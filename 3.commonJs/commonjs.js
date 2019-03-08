let fs = require('fs');
let path = require('path');
let vm = require('vm');

// 封装一个Module类
function Module(id) {
  this.id = id;
  this.exports = {};
}

// js加载的时候需要在外层包裹一层函数
Module.wrap = [
  "(function(exports, module, require, __dirname,__filename){",
  "\r\n})"
]

// 针对不同扩展名的模块使用不同的策略加载
Module._extension = {
  '.js'(module) {
    let jsContent = fs.readFileSync(module.id, 'utf8');
    let jsStr = Module.wrap[0] + jsContent + Module.wrap[1];
    let fn = vm.runInThisContext(jsStr);
    // 外层包裹的函数中的 this === module.exports
    fn.call(module.exports, module.exports, module, req);
  },
  '.json'(module) {
    let json = fs.readFileSync(module.id, 'utf8');
    module.exports = json;
  },
  '.node'() {

  }
}

// 如果加载过，就缓存起来
Module._cache = {}

// 尝试加载模块的方法
function tryModuleLoad(module) {
  // 获取模块的扩展名
  let extension = path.extname(module.id);
  Module._extension[extension](module);
}

function req(modulePath) {
  // 获取当前要加载的绝对路径 尝试去加载这个模块 req方法会默认返回module.exports;
  let absPath = path.resolve(__dirname, modulePath);
  if (Module._cache[absPath]) { // 如果该文件已经加载过
    return Module._cache[absPath].exports;
  }
  let module = new Module(absPath);
  Module._cache[absPath] = module;
  tryModuleLoad(module);
  return module.exports;
}
module.exports = req;