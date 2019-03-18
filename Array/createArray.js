//创建数组

//通过[]生命一个数组变量
var numbers = [];

//调用Array的构造函数创建数组
var numbers = new Array();

//可以调用Array.isArray()判断对象是否是数组

// 2.2.3 由字符串生成数组
//可以调用字符串的 split() 方法
var sentence = 'the quick';
var words = sentence.split(' ');
for(var i = 0; i < words.length; i++) {
    console.log('word' + i + ': ' + words[i]);
}
// => word 0: the;   word 1: quick

//关于数组的整体性操作中 浅复制 与 深复制

//浅复制：
//当把一个数组赋给另外一个数组时，只是为被赋值的数组增加了一个新的引用
var nums = [];
for (var i = 0; i < 100; ++i) {
    nums[i] = i+1;
}
var samenums = nums;
nums[0] = 400;
console.log(samenums[0]); // 显示 400

//深复制：
//将原数组中的每一个元素都复制一份到新数组中
//写一个深复制函数：
function copy(arr1, arr2) {
    for(var i = 0; i < arr1.length; i++) {
        arr2[i] = arr[i];
    }
}

var nums = [];
for (var i = 0; i < 100; ++i) {
    nums[i] = i+1;
}
var samenums = [];
copy(nums, samenums);
nums[0] = 400;
console.log(samenums[0]); // 显示 1