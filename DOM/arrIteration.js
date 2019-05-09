/**
 * Array迭代方法：
 * # every: 数组每一项运行给定函数，如果对每一项都返回 true， 则返回 true.
*/

var  nums = [1,2,3,4,5,6,67,34];

var everyResult = nums.every(function(item, index, array) {
    return (item > 2);
});
console.log(everyResult);