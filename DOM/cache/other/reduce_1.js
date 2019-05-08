/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */

/*
 *reduce
 *reduce(function(memo, item, index, array){ ... }, [initial])   ⇒ value
 *与 Array.reduce有相同的用法，遍历当前对象集合。memo是函数上次的返回值。迭代进行遍历。

 *这是一个zepto的方法，不是jquery的api
 */

;(function(undefined) {
  if (String.prototype.trim === undefined) // fix for iOS 3.2
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '')
  }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  //这个方法的作用就是累似一个累计处理的作用，将前一条数据的处理结果用作下一次的处理
  //比如[1,2,3,4,].reduce(function(x,y){ return x+y}); ==> ((1+2)+3)+4,

  if (Array.prototype.reduce === undefined) Array.prototype.reduce = function(fun) {
    if (this === void 0 || this === null) throw new TypeError()
    var t = Object(this),
      len = t.length >>> 0,
      k = 0,
      accumulator
    if (typeof fun != 'function') throw new TypeError()
    if (len == 0 && arguments.length == 1) throw new TypeError()
    //取初始值  
    if (arguments.length >= 2) accumulator = arguments[1] //如果参数长度大于2个，则将第二个参数作为初始值
    else do {
      if (k in t) {
        accumulator = t[k++] //否则将数组的第一条数据作为初绍值
        break
      }
      if (++k >= len) throw new TypeError() //什么情况下会执行到这里来？？？
    } while (true)
    //遍历数组，将前一次的结果传入处理函数进行累计处理
    while (k < len) {
      if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
      k++
    }
    return accumulator
  }

})()