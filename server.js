let http = require('http');
let url = require('url');
let path = require('path');
let routes = require('./routes');

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
                    console.log(e.message);
                    resp.writeHead(500);
                    resp.end('LOL');
                }
            }
            resp.end();

        }).listen(port);
    }

}

Server.start(3000);