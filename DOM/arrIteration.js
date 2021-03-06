/**
 * Array迭代方法：
 * # every(): 数组每一项运行给定函数，如果对每一项都返回 true， 则返回 true。
 * # filter(): -------------------，返回结果为 true 的项组成的 数组。
 * # forEach(): ------------------, 没有返回值。
 * # map(): ----------------------, 返回每次函数调用的结果 组成的数组。
 * # some(): ---------------------, 函数对任意一项返回 true, 则返回 true。
*/

var  nums = [1,2,3,4,5,6,67,34];

// every()
var everyResult = nums.every(function(item, index, array) {
    return (item > 2);
});
console.log(everyResult);  //false

// some()
var someResult = nums.some(function(item, index, array) {
    return (item > 2);
});
console.log(someResult);  //true

// filter()
var filterResult = nums.filter(function(item, index, array) {
    return (item > 2);
});
console.log(filterResult);  // [3, 4, 5, 6, 67, 34]

// map()
var mapResult = nums.map(function(item, index, array) {
    return item*2;
});
console.log(mapResult);  // [2, 4, 6, 8, 10, 12, 134, 68]

// forEach()
nums.forEach(function(item, index, array) {
    // 执行某些操作
});

//=================================  ES6 关于数组的扩展  =====================================================

/**
 * 0. ES6 关于数组的扩展
 * 
 * 1. 扩展运算符
 * 2. Array.from()
 * 3. Array.of()
 * 4. 数组实例的 copyWithin()
 * 5. --------- find() 和 findIndex()
 * 6. --------- fill()
 * 7. --------- entries(), keys() 和 values()
 * 8. --------- includes()
 * 9. --------- flat(), flatMap()
 * 10. 数组的空位
 * 
*/

//================================ * 1. 扩展运算符 spread ===========================================

//====== (...), 将一个数组转为用逗号分隔的参数序列
console.log(...[1, 2, 3]); // 1 2 3
console.log(1, ...[2, 3, 4], 5); // 1 2 3 4 5
[...document.querySelectorAll('div')]; // [<div>, <div>]

//===== 也主要用于函数调用
function push(array, ...items) {
    array.push(...items);
}

function add(x, y) {
    return x + y;
}
const numbers = [4, 38];
add(...numbers); // 运算符将一个数组，变为参数序列  // 42

//===== 与正常函数参数结合使用
function f(v, e, d, s, g) {}
const args = [0, 1];
f(-1, ...args, 2, ...[3]);

//===== 后面可以放表达式
const arr = [
    ...(x > 0 ? ['a'] : []),
    'b',
];

// ==== 如果是空数组，不产生任何效果
[...[], 1]; //[1]

// ==== 注意，只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错
(...[1, 2]) // Uncaught SyntaxError: Unexpected number
console.log((...[1, 2])) //同上
console.log(...[1, 2])  // 1 2

// ========= 替代函数的 apply 方法
// ES5 写法
function f(x, y, z) {
    // ...
}
var args = [1, 2, 3];
f.apply(null, args);

// ES6的写法
let args = [1, 2, 3];
f(...args);

// =======  求出一个数组中最大元素的写法
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);

// ===== 将一个数组添加到另一个数组的尾部
// ES5 
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);

// ES5
new (Date.bind.apply(Date, [null, 2015, 1, 1]))
// ES6
new Date(...[2015, 1, 1]);

//==================== 1. 扩展运算符 spread 的应用 ==================
/**
 * 1. 复制数组（数组是复合数据类型，直接复制只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组）
 */
const a1 = [1, 2];
const a2 = a1;
a2[0] = 2;
a1 // [2, 2] //指针的复制而已
// ES5 只能通过变通的方法复制数组
const a2 = a1.concat();
a2[0] = 2;
a1 // [1, 2]

// ES6 下面两种写法， a2都是a1的克隆
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;

/**
 * 2. 合并数组
 */
// 都是浅拷贝
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// es5
arr1.concat(arr2, arr3);  // ['a', 'b', 'c', 'd', 'e']

// es6
[...arr1, ...arr2, ...arr3]  // ['a', 'b', 'c', 'd', 'e']

/**
 * 3. 与解构赋值结合
 */
// es5
a = list[0], rest = list.slice(1);
// es6
[a, ...rest] = list


const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest //[2, 3, 4, 5]

const [first, ...rest] = []
first //undefined
rest // []

const [first, ...rest] = ['foo'];
first // 'foo'
rest // []

// 如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则报错
const [...butlast, last] = [1, 2, 3, 4, 5];
// 报错

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// 报错

/**
 * 4. 字符串
 */

 [...'hello'] //['h', 'e', 'l', 'l', 'o']
//  上面能够正确识别四个字节的 Unicode 字符
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
//上面第一种写法，JS会将四个字节的 Unicode 字符，识别为 2 个字符
// 采用扩展运算符就没有这个问题。

function length(str) {
    return [...str].length;
}
length('x\uD83D\uDE80y') // 3

// 凡是涉及到操作四个字节的 Unicode 字符的函数，都有这个问题，
// 最好都用扩展运算符改写。

let str = 'x\uD83D\uDE80y';

str.split('').reverse().join('') // 'y\uDE80\uD83Dx'

[...str].reverse().join('') // 'y\uD83D\uDE80x'
// 上面代码中，如果不用扩展运算符，字符串的 reverse 操作就不正确

/**
 * 5. 实现了 Iterator 接口的对象
 */

//  任何定义了 遍历器（Iterator) 接口的对象，都可以用扩展运算
// 符转为真正的数组

let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

// 先定义了 Number 对象的遍历接口
// 扩展运算符将 5 自动转成 Number 实例后，
// 就会调用这个接口，就会返回自定义的结果。
Number.prototype[Symbol.iterator] = function*() {
    let i = 0;
    let num = this.valueOf();
    while (i < num) {
        yield i++;
    }
}
console.log([...5])  // [0, 1, 2, 3, 4]

/**
 * 6. Map 和 Set 结构， Generator 函数
 */

//  扩展运算符内部调用的是数据结构的 Iterator 接口，
// 因此只要具有 Iterator 接口的对象，都可以使用扩展运算符
let map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
]);
let arr = [...map.keys()]; // [1, 2, 3]

// Generator 函数运行后，返回一个遍历器对象，一次也可以使用扩展运算符
const go = function*() {
    yield 1;
    yield 2;
    yield 3;
};
[...go()] // [1, 2, 3]

//================================ 2. Array.from() ===========================================
/**
 * 0. Array.from 方法用于将两类对象转为真正的数组：
 * 1. 类似数组的对象(array-like-object)
 * 2. 可以遍历 (iterator) 的对象 (包括 ES6 新增的数据结构 Set 和 Map)
 */

 let arrayLike = {
     '0': 'a',
     '1': 'b',
     '2': 'c',
     length: 3
 };
//  es5
var arr1 = [].slice.call(arrayLike);  //['a', 'b', 'c']
// es6
var arr2 = Array.from(arrayLike); //['a', 'b', 'c']

// 常见的 NodeList 集合 以及 arguments对象都可以
// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
    return p.textContent.length > 100;
});

// arguments 对象
function foo() {
    var args = Array.from(arguments);
    // ...
}

// 只要部署了 Iterator 接口的数据结构，都可以将其站位数组
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b']);
Array.from(namesSet); //['a', 'b']

// 如果参数是一个真正的数组，Array.from会返回一个一模一样的 新数组
Array.from([1, 2, 3]) // [1, 2, 3]

// 扩展运算符 (...)， 也可以将某些数据结构转换为数组
// arguments 对象
function foo() {
    const args = [...arguments];
}

// NodeList对象
[...document.querySelectorAll('div')]
// 扩展运算符背后调用的是遍历器接口(Symbol.iterator)
// Array.from 方法还支持 类数组对象，他必须有 length
// 此时扩展运算符就无法转换了

// 对于还没有部署方法的浏览器，可以使用 Array.prototype.slice方法替代
const toArray = (() => 
    Array.from ? Array.from : obj => [].slice.call(obj)
)();

// Array.from可以接受第二个参数，类似数组map方法
// 对每个元素进行处理，将处理后的值放入返回的数组
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x);
// [1, 4, 9]

// 取出一组DOM节点的文本内容
let spans = document.querySelectorAll('span.name');
//map()
let name1 = Array.prototype.map.call(spans, s => s.textContent);
// Array.from()
let name2 = Array.from(spans, s => s.textContent);

// 将数组中的布尔值为 false 的成员 转为 0；
Array.from([1, , 2, , 3], (n) => n || 0) // [1, 0, 2, 0, 3]

// 返回各种数据的类型
function typesOf() {
    return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN); // ['object', 'object', 'number']

// 如果map函数里面用到了 this 关键字，还可以传入Array.from的第三个
// 参数，用来绑定this
Array.from({ length: 2 }, () => 'jack'); //['jack', 'jack']
// 上面第一个参数指定了第二个参数运行的次数。

// Array.from() 另一个应用是将 字符串 转为 数组，然后返回字符串的长度
function countSymbols(str) {
    return Array.from(str).length;
}

//================================ 3. Array.of() ===========================================
// Array.of() 方法用于将一组 值， 转换为数组
Array.of(3, 11, 8) //[3, 11, 8]
Array.of(3, 11, 8).length; // 3
// Array.of总是返回参数值组成的数组。如果没有参数，就返回一个空数组。
// 模拟 Array.of 方法
function ArrayOf() {
    return [].slice.call(arguments);
}

//================================ 4. 数组实例的 copyWithin()  ===============================
// 在数组内部，将指定位置 的成员 复制 到其他位置（会覆盖原有成员）
// 然后返回当前数组，也就是会修改当前数组
/**
 * 0. copyWithin(target, start, end)
 * 1. target(必选): 从该位置开始替换数据。如果为负值，表示倒数。
 * 2. start(可选): 从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
 * 3. end(可选): 到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
 * 4. 这 3个参数都是数值 ，如果不是 自动转换为数值
 */
Array.prototype.copyWithin(target, start = 0, end = this.length);
[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]

// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}

// 将2号位到数组结束，复制到0号位
let i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

// 对于没有部署 TypedArray 的 copyWithin 方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]

//================================ 5. 数组实例的 find() 和 findIndex()  ====================
