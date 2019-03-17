let http = require('http');
let url = require('url');

function application() {
  let app = (req, res) => {
    let {pathname} = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    for(let i = 0; i < app.routes.length; i++) {
      let {path, method, handle} = app.routes[i];
      if (path === pathname && requestMethod === method) {
        return handle(req, res);
      }
    }
  }

  // 存放
  app.routes = [];
  // 
  app.get = function(path, handle) {
    let layer = {
      path,
      method: 'get',
      handle
    };
    app.routes.push(layer);
  }

  app.listen = function() {
    let server = http.createServer(app);
    server.listen(...arguments);
  }
  return app;
}

module.exports = application;