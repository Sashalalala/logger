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
                    resp.end(JSON.stringify(result));
                }, err=> {
                    console.log(err);
                   return helpers.set400(resp);
                });
        }
    }
};

module.exports = root;