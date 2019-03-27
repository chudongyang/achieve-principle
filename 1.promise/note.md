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