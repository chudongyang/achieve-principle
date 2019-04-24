let express = require('express');

let app = express();
let whiteList = ['http://127.0.0.1:5500']; // 设置白名单，允许哪些地址跨域请求
// cros解决跨域的方案，就是需要服务端设置针对跨域的响应头
app.use(function(req,res,next){
  if (whiteList.includes(req.headers.origin)){
    // 设置允许跨域的地址, 这里最好不要设置为'*', 否则不允许强制携带cookie
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // 设置跨域时候允许携带的请求头, 这里如果是多个请求头注意写法
    res.setHeader('Access-Control-Allow-Headers', 'token,Content-Type');
    // 设置允许你跨域请求的方法
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    // 设置options预请求发送的时间间隔
    res.setHeader('Access-Control-Max-Age', '10');
    // 允许前端访问携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    // 设置客户端可以拿到那些响应头（除了Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma六种外）
    res.setHeader('Access-Control-Expose-Headers', 'name');
    if (req.method === 'options') { // options是预请求，不需要做任何处理
      res.end();
    }
  }
  next();
})
// cors.html 调用的接口
app.put('/cors', function(req, res){
  res.setHeader('name', 'world');
  res.end(`cros跨域请求成功`);
})
app.listen(3000);