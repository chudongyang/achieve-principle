let express = require('express');
let proxy = require('http-proxy-middleware');
let app = express();
app.use(express.static(__dirname));
app.use('/api', proxy({
  target: 'http://localhost:4000', // 目标域名
  changeOrigin: true // 将主机标头的源更改为目标URL
}))

app.listen(3000);