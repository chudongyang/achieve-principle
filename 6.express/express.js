let http = require('http');
let url = require('url');
let methods = require('methods');

function application() {
  let app = (req, res) => {
    let {pathname} = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    for(let i = 0; i < app.routes.length; i++) {
      let {path, method, handle} = app.routes[i];
      // 如果路由中 路径是*能匹配到， 方法是all 也能匹配到
      if ((path === pathname || path === '*' ) && (requestMethod === method) || (method === 'all')) {
        return handle(req, res);
      }
    }
    // 找不到任何路由
    res.end(`Cannot ${requestMethod} ${pathname}`);
  }

  // 存放 方法调用时的layer
  app.routes = [];
  // 
  [...methods, 'all'].forEach(method => {
    app[method] = function(path, handle) {
      let layer = {
        path,
        method,
        handle
      };
      app.routes.push(layer);
    }
  })
  
  app.listen = function() {
    let server = http.createServer(app);
    server.listen(...arguments);
  }
  return app;
}

module.exports = application;