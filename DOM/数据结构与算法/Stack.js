/**
 * 后进先出 LIFO
 * 
 * push: 添加元素到栈顶(也就是数组的末尾，返回修改后数组的长度)
 * pop: 移除栈顶元素，同时返回被移除元素(返回的是移除的项)
 * peek: 返回栈顶元素，不对栈做任何修改
 * isEmpty: 如果栈里面没有任何元素就返回true, 否则返回false;
 * clear: 移除栈里的所有元素
 * size: 返回栈里的元素个数。
 * 
 */

function Stack() {
    let items = [];

    this.push = function(element) {
        items.push(element);
    };
    this.pop = function(element) {
        return items.pop();
    };
    this.peek = function() {
        return items[items.length-1];
    };
    this.isEmpty = function() {
        return items.length == 0;
    };
    this.size = function() {
        return items.length;
    };
    this.clear = function() {
        items = [];
    };
    this.print = function() {
        console.log(items.toString());
    };
}

// let stack = new Stack();
// stack.push(3);
// stack.clear();
// console.log(stack.peek());

function baseConverter(decNumber, base) {
    var remStack = new Stack();
    var rem;
    var baseString = '';
    var digits = '0123456789ABCDEF';

    while(decNumber > 0) {
        //求模，只是求余数而已
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }

    while(!remStack.isEmpty()){
        //后进先出，寻找匹配的项，合成字符串输出
        baseString += digits[remStack.pop()];
    }

    return baseString;
}

console.log(baseConverter(1662, 16));