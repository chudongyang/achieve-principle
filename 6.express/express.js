let http = require('http');
let url = require('url');
let methods = require('methods');
let mime = require('mime');
let fs = require('fs');

function application() {
  let app = (req, res) => {
    let {pathname} = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    let index = 0;
    function next(err){
      if (index === app.routes.length) {
        res.statusCode = 404;
        return res.end(`Cannot ${requestMethod} ${pathname}`);
      }
      let {path, method, handler} = app.routes[index++];
      if (err) {
        // handler.length 指的是函数的参数个数
        if (method === 'middleware' && handler.length === 4) {
          return handler(err, req, res, next);
        } else {
          next(err);
        }
      } else {
        if (method === 'middleware') { // 中间件的逻辑
          if (path === pathname || path === '/' || pathname.startsWith(path + '/')) {
            return handler(req,res, next);
          } else {
            next();
          }
        } else { // 路由逻辑
          if (path.params) {
            let matchs = pathname.match(path);
            if (matchs) {
              let [, ...lists] = matchs;
              // 逗号运算符，返回的是逗号后面的那一项
              req.params = path.params.reduce((memo, current, index) => (memo[current] = lists[index], memo), {})
              return handler(req, res);
            }
          }
          // 如果路由中 路径是*能匹配到， 方法是all 也能匹配到
          if ((path === pathname || path === '*' ) && (requestMethod === method) || (method === 'all')) {
            return handler(req, res);
          }
        }
        // 这里需要调用next
        next();
      }
    }
    next(index);
  }

  // 存放 方法调用时的layer
  app.routes = [];
  // 
  [...methods, 'all'].forEach(method => {
    app[method] = function(path, handler) {
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
        handler
      };
      app.routes.push(layer);
    }
  })
  // 中间件的实现
  app.use = function(path, handler){
    // 如果没传path，那么默认路径是 '/'
    if (typeof handler !== 'function') {
      handler = path;
      path = '/';
    }
    let layer = {
      path,
      method: 'middleware',
      handler
    };
    app.routes.push(layer);
  }

  app.use(function(req, res, next) {
    let {query, pathname} = url.parse(req.url);
    req.query = query;
    req.path = pathname;
    res.send = function(value) {
      if (typeof value === 'object') {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(JSON.stringify(value));
      } else if (typeof value === 'number') {
        let status = require('_http_server').STATUS_CODES;
        res.statusCode = value;
        res.end(status[value]);
      } else {
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(value);
      }
    }
    res.sendFile = function(p) {
      res.setHeader('Content-Type', `${mime.getType(p)};charset=utf-8`);
      fs.createReadStream(p).pipe(res);
    }
    next();
  })
  
  app.listen = function() {
    let server = http.createServer(app);
    server.listen(...arguments);
  }
  return app;
}

module.exports = application;