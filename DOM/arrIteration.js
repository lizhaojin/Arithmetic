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
