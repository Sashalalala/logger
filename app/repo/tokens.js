let helpers = require('../helpers');
let config = require('../../config');
function tokensRepo(conn) {

    this.conn = conn;


    this.getToken = function (userId) {
        let self = this;
        let conn = this.conn;
        return new Promise(function (resolve, reject) {
            let expired = helpers.getExpiredAt();
            let query = "SELECT token, expired from user_tokens WHERE user_id=? AND expired>?";
            conn.query(query, [userId, expired], function (err, result, field) {
                if(err){
                    reject(err);
                }
                if(result.length){
                    resolve({userId:userId,token:result[0].token,expired:result[0].expired});
                } else  {
                     let token = helpers.generateToken();
                     self.insertToken(userId, token).then(
                         result=>{
                             resolve(result);
                         },
                         err=>{
                             reject(err);
                         }
                     );
                 }
            });
        })
    };

    this.insertToken = function(userId, token){
        let conn = this.conn;
        return new Promise(function (resolve, reject) {
            let query = 'INSERT INTO user_tokens (user_id, token, expired) values(?,?,?);';
            let expired = Math.floor(Date.now()/1000) + config.token_expired;
            conn.query(query, [userId, token, expired], function (err,result,field) {
                if(err){
                    reject(err);
                }
                resolve({userId:userId,token:token, expired:expired});
            })
        });
    };

    this.deleteExpired = function () {
        let conn = this.conn;
        let self = this;
        return new Promise(function (resolve, reject) {
            let expired = Math.floor(Date.now()/1000) + config.token_expired;
            let query = "SELECT token FROM user_tokens WHERE expired >=?";
            conn.query(query, function (err,result,field) {
                if(err){
                    reject(err);
                }
                if(result.length){
                    let expiredTokens = [];
                    for (let i=0;i<result.length;i++){
                        expiredTokens.push(result[i].token);
                    }
                    let expiredStr = "'"+expiredTokens.join("','")+"'";
                    return self.deleteTokens(expiredStr);
                }
            })
        })
    };

    this.deleteTokens = function (tokens) {
        let conn = this.conn;
        return new Promise(function (resolve, reject) {
            let query = 'DELETE FROM user_tokens WHERE token IN ('+tokens+');';
            conn.query(query, function (err,result,field){
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        });
    };
}

module.exports = tokensRepo;
