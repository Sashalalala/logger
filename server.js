let http = require('http');
let url = require('url');
let routes = require('./app/routes/routes');

class Server{

    static start(port){
        this.createServer(port);
    }

    static getHandler(route){
        return require('./app/handlers/' + route.handler);
    }


    static createServer(port){
        let self = this;

        http.createServer(function (req, resp) {
            resp.setHeader('Access-Control-Allow-Origin', '*');
            resp.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            resp.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

            let path = url.parse(req.url).pathname;
            let route = routes.find(path);
            if(!route) {
                resp.writeHead(404);
                resp.end('Not found');
            } else {
                try {
                    let handler = self.getHandler(route);
                    handler[route.action](req, resp);
                } catch (e){
                    console.log(e);
                    resp.writeHead(500);
                    resp.end('LOL, 500' + process.env.NODE_ENV);
                }
            }
        }).listen(port);
    }

}

Server.start(3000);