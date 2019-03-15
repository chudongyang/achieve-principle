// ssr 的原理就是服务端用模板加数据渲染好一个字符串 返给客户端
let ejs = require('./ejs');
let fs = require('fs');
let path = require('path');
let obj = {name:'chudongyang', age: '28', hobby: ['music', 'movie', 'code']};

let tempStr = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

console.log(ejs.render(tempStr, obj));