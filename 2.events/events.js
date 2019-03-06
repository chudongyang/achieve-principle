class EventEmitter {
  constructor() {
    // 分类存储订阅的函数 {'吃饭': [fn1, fn2], '爱好': [fn3, fn4]} Object.create(null)创建一个对象的好处是没有原型链上的那些属性和方法
    this._events = Object.create(null); 
  }
  // 订阅事件函数
  on(eventName, fn) {
    if (this._events[eventName]) { 
      this._events[eventName].push(fn);
    } else { // 第一次添加
      this._events[eventName] = [fn];
    }
  }
  // emit发布函数 第一个参数是发布的事件名，其他参数会传给依次执行的订阅函数
  emit(eventName, ...args) {
    this._events[eventName].forEach(fn => {
      fn(...args);
    });
  }
  // 取消订阅事件 只能移除一个监听器，多次添加的需要多次调用才能移除所有订阅函数
  off(eventName, callback) {
    this._events[eventName] = this._events[eventName].filter(fn => fn !== callback);
  }
}

module.exports = EventEmitter;