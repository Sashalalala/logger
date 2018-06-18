let config = require('../config');
let helpers = {

    parsePostData: function (data) {
        let type = data.type;
        try {
            switch (type) {
                case 'application/json' : {
                    return JSON.parse(data.data);
                }
                default : {
                    throw new Error('Parce Error') ;
                }
            }
        } catch (e){
            return e;
        }
    },
    postData: function (req) {
        return new Promise(function (resolve, reject) {
            if(req.method === 'POST'){
                let body = '';
                let contentType = req.headers['content-type'];
                try {
                    req.on('data', function (chunk) {
                        body += chunk.toString();
                    });
                    req.on('end', function () {
                        resolve({
                            type:contentType,
                            data:body
                        });
                    });
                } catch (e){
                    reject(e);
                }
            } else {
                resolve({type:'', data:''})
            }
        });
    },
    set400 : function (resp, message) {
        resp.writeHead(400);
        resp.statusMessage = message || 'Bad request';
        resp.end()
    },
    set500 : function (resp, message) {
        resp.writeHead(500);
        resp.statusMessage = message || 'Internal server error';
        resp.end()
    },
    getErorrData : function (error_type){
        return require('./errors')[error_type];
    },

    responceFormat: function (statusCode, data, resp) {
        let responce = {};
        responce.success = (statusCode>=200 && statusCode<300);
        responce.data = data;
        try{
            if(resp){
                resp.writeHead(statusCode);
            }
            return JSON.stringify(responce);
        } catch (e){
            if(resp){
                resp.writeHead(500);
                resp.statusMessage = 'Internal server error'
            }
            console.log('Response formatter: ', e);
            return '';
        }
    },

    generateToken : function () {
        let crypto = require('crypto');
        let str = crypto.randomBytes(32).toString('hex') + Date.now().toString();
        return str;

    },
    isTokenValid : function (expiredAt) {
        return Math.floor(Date.now()/1000) <= expiredAt;
    },
    getExpiredAt: function () {
        return Math.floor(Date.now()/100) + config.token_expired;
    },

    generateFileName: function () {
        let crypto = require('crypto');
        return Math.floor(Date.now()/1000).toString(16) + '-' + crypto.randomBytes(4).toString('hex')+'.log';
    },

    createLogFile: function (data, userId) {
        let self = this;
        let fs = require('fs');
        return new Promise(function (resolve, reject){
            let filename = './' + config.log_dir + '/' + self.generateFileName();
            fs.writeFile(filename, data, function (err) {
                if(err){
                    reject(err);
                } else {
                    resolve({userId : userId, path:filename});
                }
            })
        });

    }
};

module.exports = helpers;