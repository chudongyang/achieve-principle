let express = require('./express');
let path = require('path');
let app = express();

// app.use('/api', function(req, res, next){
//   console.log(1);
//   next();
// })

// app.use('/api', function(req, res, next){
//   console.log(2);
//   next();
// })

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'index.html'));
})

app.get('/api', function(req, res){
  res.end('api home');
})

app.get('/index/:id/:name', function(req, res){
  res.end(JSON.stringify(req.params));
})

// curl postman 测试post请求
app.post('/home', function(req, res){
  res.end('post home');
})

// 匹配所有的请求方法 所有的路径
// app.all('*', function(req, res) {
//   res.end('404');
// })

// app.use(function(err, req, res, next){
//   res.end('wrong');
// })

app.listen(3000, function(){
  console.log('3000 start');
})