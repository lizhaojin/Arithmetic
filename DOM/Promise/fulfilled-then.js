/**
 * 展示了promise作为队列最重要的一个特性
 * 我们声明了一个promise之后可以把它作为一个
 * 变量传递到其他的地方
 * 
 */

console.log('start');

let promise = new Promise(resolve => {
    setTimeout( () => {
        console.log('the promise fulfilled');
        resolve('hello, world');
    }, 1000);
});

setTimeout( () => {
    promise.then( value => {
        console.log(value);
    });
}, 3000);