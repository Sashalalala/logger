let repository = require('../repo/repository');
let helpers = require('../helpers');
let root = {
    auth : function (req, resp) {

        if(req.method !=='POST'){
            resp.writeHead('400');
            resp.statusMessage = 'Bad request';
            resp.end();
        } else {
            let userRepo = new repository('users');
            helpers.postData(req)
                .then( data => {
                    let userData = helpers.parsePostData(data);
                    if(!userData){
                        helpers.set400(resp,'unsupported data format');
                    }
                    let login = userData.login;
                    let pass = userData.pass;

                    if(!login || !pass){
                        return helpers.set400(resp);
                    }
                    return {
                        login: login,
                        pass : pass
                    }
                })
                .then(userData => {
                    let userRepo = new repository('users');
                    return userRepo.getUser(userData.login, userData.pass);
                })
                .then(userId=>{
                    if(!userId) return helpers.returnErorr(resp, 400, 'userNotFound')
                    return resp.end(userId.toString());
                });
        }
    }
};

module.exports = root;