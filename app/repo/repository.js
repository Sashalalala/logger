
const config = require('../../config').db;
let connection = require('mysql').createConnection(config);

function Repository(name) {
    let repo = require('./'+name);
    return new repo(connection);
}

module.exports = Repository;