
let Routes = {
    routes: {
        '/auth':{
            handler:'root',
            action:'auth'
        },
        '/get':{
            handler:'root',
            action:'getLogs'
        },
        '/upload':{
            handler:'root',
            action:'upload'
        }
    },
    find :function(path){
        for(let route in this.routes){
            if(path === route)  return this.routes[route];
        }
        return false;
    }
};

module.exports = Routes;