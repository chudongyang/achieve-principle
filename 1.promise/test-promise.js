let Promise = require('./Promise');
let promise = new Promise((resolved, rejected) => {
  rejected('success')
  // rejected('error')
})

Promise.resolve(123).then((data)=> {
  console.log(data);
})