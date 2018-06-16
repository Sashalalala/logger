
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
    }
}

module.exports = users;