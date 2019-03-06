let EventEmitter  = require('events');
// let EventEmitter = require('./events');

let e = new EventEmitter();

let fn1 = function(...args) {
  console.log('旅行', args);
}
let fn2 = function(...args) {
  console.log('音乐', args);
}

e.on('爱好', fn1);

e.on('爱好', fn1);

e.on('爱好', fn2);
e.off('爱好', fn1);

e.emit('爱好', 1, 2);