let express = require('express');
let app = express();

app.get('/api', function(req, res) {
  res.send('访问4000成功')
})
app.listen(4000);