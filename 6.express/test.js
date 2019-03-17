let express = require('./express');

let app = express();

app.get('/', function(req, res){
  res.end('home');
})

app.get('/index', function(req, res){
  res.end('index page');
})


app.listen(3000, function(){
  console.log('3000 start');
})