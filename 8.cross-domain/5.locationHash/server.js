let express = require('express');

let app = express();
// 设置静态文件的目录
app.use(express.static(__dirname));
app.listen(3000);