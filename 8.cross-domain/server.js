let express = require('express');

let app = express();
let whiteList = ['http://127.0.0.1:5500']; // 设置白名单，允许哪些地址跨域请求
// 中间件里设置针对跨域的响应头 
app.use(function(req,res,next){
  if (whiteList.includes(req.headers.origin)){
    // 设置允许跨域的地址, 这里最好不要设置为'*', 否则不允许强制携带cookie
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // 设置跨域时候允许携带的请求头
    res.setHeader('Access-Control-Allow-Headers', 'token');
    // 设置允许你跨域请求的方法
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    // 设置options预请求发送的时间间隔
    res.setHeader('Access-Control-Max-Age', '10');
    // 允许前端访问携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'options') { // options是预请求，不需要做任何处理
      res.end();
    }
  }
  next();
})
// 1.jsonp.html 调用的接口
app.get('/jsonp', function(req, res){
  let {wd, cb} = req.query;
  let result = {str: wd};
  res.end(`${cb}(${JSON.stringify(result)})`)
})
// 2.cors.html 调用的接口
app.put('/cors', function(req, res){
  res.end(`cros跨域请求成功`);
})
app.listen(3000);