function Promise(executor){
  this.status = 'pending'; // 定义状态
  this.value = undefined; // 定义成功返回的值
  this.reason = undefined; // 定义失败的原因
  // 如果executor有异步逻辑，当执行到then函数的时候，状态还没有改变，这时需要把then中的成功、失败回调保存起来，等到状态改变的时候一次执行
  this.onFulfilledCallbacks = []; // 存储then中成功的函数
  this.onRejectedCallbacks = []; // 存储then中失败的函数
  let resolve = (value) => {
    // value 可能也是一个promise
    if(value instanceof Promise){
      return value.then((data)=>{
          resolve(data)
      },y=>{
          reject(y);
      });
    }
    if (this.status === 'pending') {
      this.status = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach(fn => fn());
    }
  }
  let reject = (reason) => {
    if (this.status === 'pending') {
      this.status = 'rejected';
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn());
    }
  }
  try{
    executor(resolve, reject);
  }catch(e) {
    reject(e);
  }
}

// 解析返回值x是不是promsie
function resolvePromise(promise2, x, resolve, reject) {
  let flag; // 定义一个变量，来标识resolve或者reject有没有被调用过, 给别人的promise添加的
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise 循环引用'));
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') { // 如果是一个引用数据类型，那么可能就是promise
    try{
      let then = x.then; // 如果then属性具有getter， 此时获取时可能会发生异常
      if (typeof then === 'function') { // 如果取出来的是一个函数，就认为是promise
        then.call(x, (y)=> {
          // y可能也是一个promise, 一直解析，知道是一个常量为止
          if (flag) return;
          flag = true;
          resolvePromise(promise2, y, resolve, reject)
        }, (r)=> {
          if (flag) return;
          flag = true;
          reject(r);
        });
      }else { // 如果取出来的then属性是一个普通值, x 就是一个普通对象
        resolve(x);
      }
    }catch(e) {
      if (flag) return;
      flag = true;
      reject(e);
    }
  } else { // 如果是普通值直接成功即可
    resolve(x);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  // 实现值的穿透
  onFulfilled = typeof onFulfilled === 'function'? onFulfilled : value=> value;
  onRejected = typeof onRejected === 'function'? onRejected: err=>{throw err};
  let self = this;
  // 调用then后需要再次 返回一个全新的promise
  // 我需要拿到当前then方法 成功或失败执行后的结果
  let promise2 = new Promise(function(resolve,reject){
      if(self.status === 'fulfilled'){
        setTimeout(()=>{ // 这里要使用promise2 所有 需要增异步保证可以获取到promise2
          try{
              let x = onFulfilled(self.value);
              resolvePromise(promise2,x,resolve,reject);
          }catch(e){
              reject(e); // 如果执行函数时抛出失败 那么会走向下一个then的失败状态
          }
        },0)
      }
      if(self.status === 'rejected'){
        setTimeout(()=>{
          try{
              let x = onRejected(self.reason);
              resolvePromise(promise2,x,resolve,reject);
          }catch(e){
              reject(e);
          }
        },0)
      }
      if(self.status === 'pending'){
        // 订阅
        self.onFulfilledCallbacks.push(function(){
          setTimeout(()=>{
                  try{
                      let x =  onFulfilled(self.value);
                      resolvePromise(promise2,x,resolve,reject);
                  }catch(e){
                      reject(e);
                  }
          },0)
        });
        self.onRejectedCallbacks.push(function(){
          setTimeout(()=>{
              try{
                  let x =  onRejected(self.reason);
                  resolvePromise(promise2,x,resolve,reject);
              }catch(e){
                  reject(e);
              }
          },0);
        });
      }
  });
  return promise2;
}
Promise.prototype.catch = function(errFn) {
  return this.then(null, errFn);
}

Promise.all = function(callbacks) {
  return new Promise((resolve, reject) => {
    let result = []; // 最终的结果
    let index = 0;
    function processData(key, value) {
      index++;
      result[key] = value;
      if (index === callbacks.length) {
        resolve(result);
      }
    }
    for (let i = 0; i < callbacks.length; i++) {
      let current = callbacks[i];
      if (current && current.then && typeof current.then === 'function') {
        current.then(value=> {
          processData(i, value);
        }, reject)
      } else {
        processData(i, current);
      }
    }
  })
}

Promise.race = function (callbacks) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < callbacks.length; i++) {
      let current = callbacks[i];
      if (current && current.then && typeof current.then === 'function') {
        current.then(resolve, reject);
      } else {
        resolve(current);
      }
    }
  });
}

Promise.resolve = function(value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  })
}

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  })
}

Promise.prototype.finally = function(callback) {
  return this.then(data=> {
    callback();
    return data;
  }, reason=> {
    callback();
    throw reason;
  })
}

// 实现一个promise的延迟对象
Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;