var d = ['a', 'b', 'v', 'c'];

// push() 添加项到数组末尾
d.push('ee');
console.log(d);
// pop() 删除最后元素
d.pop();
console.log(d);

// unshift() 添加到首位
for(var i = d.length; i>=0; i--){
    d[i] = d[i-1];
}
d[0] = "bb";
console.log(d);

d.unshift('haha');
console.log(d);
// shift() 删除首位
d.shift();
console.log(d);

// splice() 在任意位置添加或者删除元素
d.splice(2, 1); //删除位置， 删除数量