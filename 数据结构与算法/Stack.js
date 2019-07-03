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

    // 向栈添加元素
    this.push = function(el) {
        items.push(el);
    };

    // 从栈移除元素
    this.pop = function() {
        return items.pop();
    };

    // 查看栈顶元素
    this.peek = function() {
        return items[items.length -1];
    };

    // 检查栈是否为空
    this.isEmpty = function() {
        return items.length == 0;
    };

    // 清空栈
    this.clear = function() {
        items = [];
    };

    // 打印栈
    this.print = function() {
        console.log(items.toString());
    };

    // 栈中元素个数
    this.size = function() {
        return items.length;
    }

}
console.log(Stack === Stack.prototype.constructor);