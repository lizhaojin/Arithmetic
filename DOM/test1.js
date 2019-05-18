function EventTarget() {
    this.handlers = {};  // 单独的属性
}

EventTarget.prototype = {
    constructor: EventTarget,

    addHandler: function(type, handler) {
        
        if (typeof this.handlers[type] === 'undefined') {
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    },

    fire: function(event) {
        
        if (!event.target) {
            event.target = this;
        };
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
     
            for (var i = 0, len=handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    },

    removeHandler: function(type, handler) {
        if (this.handlers[type] instanceof Array) {
            handlers = this.handlers[type];
            for (var i = 0, i=handlers.length; i < 0; i++) {
                if (handlers[i] === handler) {
                    break;
                }
            }
            
            handlers.splice(i, 1);
        }
    }

};


function handTest(event) {
    console.log('Message received: ' + event.message);
}


// 创建一个新对象
var target = new EventTarget();

// 添加一个事件处理程序
target.addHandler('message', handTest);

target.addHandler('hah', handTest);

// 触发事件
target.fire({ type: 'message', message: 'hello world!' });

// 删除事件处理程序
// target.removeHandler('message', handTest);

// 再次， 应没有处理程序
// target.fire({ type: 'message', message: 'hello world!' });