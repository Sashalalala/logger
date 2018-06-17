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

    returnErorr : function (resp, code, errorData){
        resp.writeHead(code);
        let errors;
        if(typeof errorData === 'string') {
            errors = require('./errors')[errorData];
        }
        resp.end(JSON.stringify({
            status : false,
            error : errors || errorData
        }));
    }
};

module.exports = helpers;