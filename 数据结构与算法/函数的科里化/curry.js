function curry(fn) {
    // 初次科里化的时候截取了5，也就是args=5，
    //此时curriedAdd依然在引用这 科里化函数本体，此时他的内部有一个变量是5的数组
    //还返回了一个匿名的函数引用，包含了args。
    //也就是使用一个闭包，返回一个函数。
    var args = Array.prototype.slice.call(arguments, 1);

    //返回一个闭包，包含初始化科里化函数时插入的参数
    return function () {

        //调用这个已经初始过的科里化后的函数curriedAdd()，
        //此时再次获取传入的参数 3，
        var innerArgs = Array.prototype.slice.call(arguments);
        //通过合并两次获得参数得到最终的参数 数组。
        var finalArgs = args.concat(innerArgs);
        //把参数传入科里化本体的参数 add() 函数，也就是调用add()函数，传入参数，
        //返回得到的结果。
        return fn.apply(null, finalArgs);
    };
}
function add(num1, num2) {
    return num1 + num2;
}
//curriedAdd是科里化的函数，指的是什么？
//在debug的时候可以看到，初始化科里化的函数时，
// 第一个参数是处理最终参数的函数。
//第二个参数可以传参，也可以不传参。
//最终调用科里化后的函数，add()并不是科里化的函数，他只是作为处理参数的函数。
var curriedAdd = curry(add, 5);
console.log(curriedAdd(3));