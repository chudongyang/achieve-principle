let express = require('express');
let WebSocket = require('ws');
// 需要下载一个第三方包 npm install wx
let wss = new WebSocket.Server({port: 3000}); // 起一个websocket服务，端口是3000
// 下面都是api固定用法
wss.on('connection', function(ws) {
  ws.on('message', function(message){
    console.log(message);
    ws.send(`我收到了你的信息了,${message}`);
  })
})
