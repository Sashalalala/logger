let repository = require('../repo/repository');
let root = {
    auth : function (req, resp) {

        let usersRepo = new repository('users');

        usersRepo.getUsers().then(
            response=>{
                console.log(response[0][1]);
                resp.end(JSON.stringify(response));
            },
            err => {console.log(err); resp.end()}
        );
    }
};

module.exports = root;