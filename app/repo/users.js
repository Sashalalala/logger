
function users(conn) {

    this.conn = conn;

    this.getUsers = function () {
        let conn = this.conn;
        return new Promise(function (resolve, reject) {
            conn.query('SELECT 1','', function (err, result, field) {
                resolve(result);
                reject(err);
            });
        });
    };

    this.getUser = function(login, pass){
        let conn = this.conn;

        return new Promise(function (resolve, reject) {
            let query = 'SELECT id from users WHERE users.login = ? AND users.pass = ?';
            conn.query(query,[login,pass], function (err, result, field) {
                console.log(result);
                if(result.length) resolve(result[0].id); else resolve(false);
                if(err){
                    reject(err);
                }
            })
        })
    }
}

module.exports = users;