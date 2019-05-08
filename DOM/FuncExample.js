// 关于递归
var factorial = (function f(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * f(num-1);
    }
});

// 私有变量
function MyObject() {

    // 私有变量和私有函数
    var parivateVariable = 10;

    function privateFunction () {
        return false;
    }

    // 特权方法
    this.publicMethod = function () {
        parivateVariable++;
        return privateFunction();
    }
}

// 1.静态私有变量
(function() {

    // 私有变量和私有函数
    var parivateVariable = 10;

    function privateFunction() {
        return false;
    }

    // 构造函数
    // 记住：初始化未经声明的变量，总是会创建一个全局变量。
    MyObject = function() {};

    // 共有、特权方法
    MyObject.prototype.publicMethod = function() {
        parivateVariable++;
        return privateFunction();
    };

})();

// 2.模块模式

var singleton = function() { // 是一个返回对象的匿名函数

    // 私有变量和私有函数
    var parivateVariable = 10;

    function privateFunction() {
        return false;
    }

    // 特权、公有方法和属性
    return {

        publicProperty: true,

        publicMethod: function() {
            parivateVariable++;
            return privateFunction();
        }
    };
}();

// 增强的模块模式
var singleton = function() {

    // 私有变量和私有函数
    var parivateVariable = 10;

    function privateFunction() {
        return false;
    }

    // 创建对象
    var object = new CustomType();

    // 添加特权、公有属性和方法
    object.publicProperty = true;

    object.publicMethod = function() {
        parivateVariable++;
        return privateFunction();
    };

    // 返回这个对象
    return object;
}();