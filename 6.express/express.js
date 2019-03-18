let http = require('http');
let url = require('url');
let methods = require('methods');

function application() {
  let app = (req, res) => {
    let {pathname} = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    for(let i = 0; i < app.routes.length; i++) {
      let {path, method, handle} = app.routes[i];
      // 当路由中含有参数时
      if (path.params) {
        let matchs = pathname.match(path);
        if (matchs) {
          let [, ...lists] = matchs;
          // 逗号运算符，返回的是逗号后面的那一项
          req.params = path.params.reduce((memo, current, index) => (memo[current] = lists[index], memo), {})
          return handle(req, res);
        }
      }
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
      // 处理路由参数 /index/:id/:name
      let params = [];
      if (path.includes(':')) {
        path = path.replace(/:([^\/]*)/g, function() {
          params.push(arguments[1]);
          return '([^\/]*)';
        })
        path = new RegExp(path);
        path.params = params;
      }
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