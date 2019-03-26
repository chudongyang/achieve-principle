# achieve-principle
Learning to achieve common Javascript library！

### 根据promise/A+规范实现promise
- 实现执行器中只是简单的同步的代码 resolved('success')或者rejected('error')
- 实现执行器中存在异步代码的情况， setTimeout(() => {resolved('success')}, 0)
- 实现当执行器中throw 抛出错误之后，then函数直接走失败的回调的情况
- 实现promise的链式调用 (这里我们需要知道的是 `then函数执行后返回的是一个新的promise`) 链式调用的的特点：
  - 如果一个then方法返回的是一个普通值，那么这个值会传递给下一个then中作为成功的结果
  - 如果then方法返回的是一个promise，会根据返回的promise是成功还是失败来 决定下一个then是成功还是失败
  - 如果then方法返回的是一个错误，那么会走下一个then中失败的函数
  - 捕获错误的机制是， 默认找离的最近的then的失败函数，没有就继续向下找
  - 与jQuery链式调用返回的this不一样，promise调用then后，会返回一个新的promise
- 实现promise.then().then().then() 这种值的穿透
- promise的测试s，使用官方提供的promises-aplus-tests包 
- 实现Promise.all()、Promise.race()、Promise.resolve()、Promise.reject()、Promise.prototype.catch()、Promise.prototype.finally()等方法, finally方法是ES2018才有的
> promise最大的有点就是链式调用

### 实现Node.js中的events事件触发器
- events模块是node中的核心模块


### commonjs规范的实现
- commonjs规范 通过文件读取（utf8）实现了模块化
  - 文件即模块
  - 定义了导出方式 module.exports  exports
  - 定义了导入方式 require
- commonjs规范的实现
  - 实现一个require方法
  - 通过Module._load 方法加载模块
  - Module._resolveFilename 根据相对路径获取绝对路径 并且增加后缀
  - 模块的缓存问题 Module._cache
  - new Module 创建模块 id存的是名字
  - tryModuleLoad(module) 尝试加载这个模块
    - 取出文件的后缀
    - 加载模块 （读取模块）
    - Module.wrap 包裹读取的内容
    - 使用runInThisContext 运行字符串
    - 让字符串执行 this改变成 exports
- module.exports 和 exports的区别 
  - exports是module.exports的别名，指向的是同一个命名空间
  - 不能直接改变exports对象的引用，因为不会影响module.exports对象

### pipe方法的实现