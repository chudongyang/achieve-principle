let express = require('./express');

let app = express();

app.get('/', function(req, res){
  res.end('home');
})

app.get('/index', function(req, res){
  res.end('index page');
})

// curl postman 测试post请求
app.post('/home', function(req, res){
  res.end('post home');
})

// 匹配所有的请求方法 所有的路径
app.all('*', function(req, res) {
  res.end('404');
})

app.listen(3000, function(){
  console.log('3000 start');
})