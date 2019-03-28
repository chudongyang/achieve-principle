let express = require('express');

let app = express();
// jsonp.html 调用的接口
app.get('/jsonp', function(req, res){
  let {wd, cb} = req.query;
  let result = {str: 'jsonp请求成功'};
  res.end(`${cb}(${JSON.stringify(result)})`)
})
app.listen(3000);