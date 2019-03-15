// 主要是使用可读流和可写流实现一下pipe方法
let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, 'read.txt'), {
  highWaterMark: 3,
});

let ws = fs.createWriteStream(path.resolve(__dirname, 'write.txt'), {
  highWaterMark: 1
})

// rs.pipe(ws); 的实现
function pipe(rs, ws) {
  rs.on('data', function(data) {
    let flag = ws.write(data);
    if (!flag) {
      rs.pause();
    }
  })
  ws.on('drain', function() {
    console.log('写入完毕， 抽干');
    rs.resume();
  })
  rs.on('end', function() {
    console.log('文件读取完毕');
    ws.end();
  })
}
pipe(rs, ws);