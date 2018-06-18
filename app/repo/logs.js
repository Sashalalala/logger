let helpers = require('../helpers');
let config = require('../../config');

function logsRepo(conn) {

    this.conn = conn;

    this.add = function(userId, logs){
        let conn = this.conn;
        return new Promise(function (resolve, reject) {
            let created_at = Math.floor(Date.now()/1000);
            let query = "INSERT INTO logs (user_id, link, created_at) VALUES(?,?,?)";
            conn.query(query,[userId,logs,created_at], function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result);
            })
        })
    }



}

module.exports = logsRepo;