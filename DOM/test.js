
// 1. ------------- Object.prototype.toString.call() ----------- 安全的类型检测
var value = [];
function isArray(value) {
    return Object.prototype.toString.call(value) == "[object Array]";
}

console.log(isArray(value));

// 2. ------------- 作用域安全的构造函数, 避免没有 new 这个关键字 ----------------
function Person(name) {
    if (this instanceof Person) {
        this.name = name;
    } else {
        return new Person(name);
    }
}

// 3. ---------惰性载入函数，---------- 第一种方式：是函数调用时在处理函数
function createXHR() {

    if (typeof XMLHttpRequest != 'undefined') {

        // 通过赋值变量，实现惰性载入函数
        // 第二次调用的时候就直接使用被分配 的函数

        createXHR = function() {
            return new XMLHttpRequest();
        };

    } else if (typeof ActiveXObject != 'undefined') {

        createXHR = function() {

            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp',],
                i, len;

                for (i = 0, len=versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (e) {
                        // skip
                    }
                }
            }

            return new ActiveXObject(arguments.callee.activeXString);
        };

    } else {

        createXHR = function() {
            throw new Error('No XHR object available.');
        };

    }

    return createXHR();
}

// 第二种方式 惰性载入函数
// 在声明函数时就指定适当的函数
var createXHR = (function() {
    
    if (typeof XMLHttpRequest != 'undefined') {

        return function() { // 关键点
            return new XMLHttpRequest();

        }

    } else if (typeof ActiveXObject != 'undefined') {

        return function() {  // 关键点

            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp',],
                i, len;

                for (i = 0, len=versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (e) {
                        // skip
                    }
                }
            }
            
            return new ActiveXObject(arguments.callee.activeXString);
        };

    } else {
        
        return function() {
            throw new Error('No XHR object available');
        };

    }

})();

// ------------ 函数绑定 --------------------
// 创建一个函数，可以在特定的this环境中以指定参数调用另一个函数
var handler = {
    message: 'Event handler',

    handleClick: function(event) {
        console.log(this.message);
    }
};

// ------------ 自定义事件 -----------------
// 事件 是一种 叫做 观察者的设计模式
function EventTarget() {
    this.handlers = {};  // 单独的属性
}

EventTarget.prototype = {
    constructor: EventTarget,

    addHandler: function(type, handler) { // 注册给定类型事件
        
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    },

    fire: function(event) { // 触发一个事件
        if (!event.target) {
            event.target = this;
        }

        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0, len=handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    },

    removeHandler: function(type, handler) {  // 销毁某个事件类型
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len=handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    break;
                }
            }

            handlers.splice(i, 1);
        }
    }
};