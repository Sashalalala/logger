let Repository = require('../repo/repository');
let helpers = require('../helpers');
let root = {
    auth: function (req, resp) {

        if (req.method !== 'POST') {
            resp.writeHead('400');
            resp.statusMessage = 'Bad request';
            resp.end();
        } else {
            helpers.postData(req)
                .then(data => {
                    let userData = helpers.parsePostData(data);
                    if (!userData) {
                        return helpers.set400(resp, 'Bad request');
                    }
                    let login = userData.login;
                    let pass = userData.pass;

                    if (!login || !pass) {
                        return helpers.set400(resp);
                    }
                    return {
                        login: login,
                        pass: pass
                    }
                })
                .then(userData => {
                    let userRepo = new Repository('users');
                    return userRepo.getUser(userData.login, userData.pass);
                })
                .then(user => {
                    if (!user) {
                        let response = helpers.responceFormat(400,helpers.getErorrData('invalid_user_data'),resp);
                        return resp.end(response);
                    }
                    let tokenRepo = new Repository('tokens');
                    return tokenRepo.getToken(user.id);
                }, err => {
                    console.log(err);
                    return resp.end();
                })
                .then(result=>{
                    let response = helpers.responceFormat(200, result, resp);
                    resp.end(response);
                }, err=> {
                    console.log(err);
                   return helpers.set400(resp);
                });
        }
    },
    postLogs: function (req, resp) {

        if(req.method !== 'POST'){
            resp.writeHead('400');
            resp.statusMessage = 'Bad request';
            resp.end();
        } else {
            helpers.postData(req)
                .then( reqBody =>{
                    let data = helpers.parsePostData(reqBody);
                    if(data.token !== undefined){
                        let tokenRepo = new Repository('tokens');
                        tokenRepo.check(data.token)
                            .then(check=>{
                                return check.userId;
                            }, err=>{
                                if(err.check !==undefined && !err.check){
                                   let response = helpers.responceFormat(401,helpers.getErorrData('invalid_token'),resp);
                                   resp.end(response);
                                }
                            })
                            .then(userId=>{console.log(1545);

                                if(data.logs == undefined){
                                    let response = helpers.responceFormat(400,helpers.getErorrData('logs_not_found'),resp);
                                    return resp.end(response);
                                }
                                return helpers.createLogFile(data, userId);
                            })
                            .then(result=>{
                                let logsRepo = new Repository('logs');
                                return logsRepo.add(result.userId,result.path);
                            }, err=>{
                                "use strict";
                                console.log(err);
                                resp.end();
                            })
                            .then(result=>{
                                let responce = helpers.responceFormat(200, {}, resp);
                                resp.end(responce);
                            }, err=>{
                                console.log(err);
                                helpers.set500(resp);
                            })
                    } else {
                        let responce = helpers.responceFormat(400,helpers.getErorrData('invalid_token'), resp);
                        resp.end(responce);
                    }
                })
        }

    }
};

module.exports = root;