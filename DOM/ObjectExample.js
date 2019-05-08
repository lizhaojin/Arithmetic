// 工厂模式
function createPerson(name){
    var o = new Object();
    o.name = name;

    o.sayName = function () {
        console.log(this.name);
    };
    return o;
}

// 构造函数模式
function Person(name) {
    this.name = name;
    this.sayName = function (){
        console.log(this.name);
    };
}

// 原型模式
function Person() {}
Person.prototype.name = name;
Person.sayName  = function () {
    console.log(this.name);
};
// 用字面量重写原型模式
function Person() {}
Person.prototype = {
    // constructor: Person,
    name: "lili",
    sayName: function() {
        console.log(this.name);
    }
};
Object.defineProperty(Person.prototype, "constructor", {
    enumerable: false,
    value: Person
});

// 组合使用构造函数模式和原型模式
// 避免引用类型的污染
function Person(name) {
    this.name = name;
    this.color = ["red", "blue"];
}
Person.prototype = {
    constructor: Person,
    sayName: function () {
        console.log(this.name);
    }
}
// 动态原型模式
function Person(name) {
    this.name = name;

    if (typeof this.sayName != "function") {
        
        Person.prototype.sayName = function () {
            console.log(this.name);
        };
    }
}
// 寄生构造函数模式
function Person(name) {
    var o = new Object();
    o.name = name;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}
// 稳妥构造函数
function Person(name) {

    // 创建要返回的对象
    var o = new Object();

    // 可以在这里定义私有变量和函数

    // 添加方法
    o.sayName = function (){
        console.log(name);
    };

    // 返回对象
    return o;
}

// ----------------
// 经典继承
function F(name) {
    this.name = name;
    this.color = ["red", "blue"];
}
F.prototype.sayName = function () {
    console.log(this.name);
};

function C(name, age) {

    // 继承属性
    F.call(this, name);
    this.age = age;
}
// 继承方法
C.prototype = new F();
C.prototype.constructor = F;
C.prototype.sayAge = function () {
    console.log(this.age);
};

// 原型继承 相当于Object.create()
// 属于浅复制
function object(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
var person = {
    name: "li",
    color: ["red", "blue"]
};
var anotherPerson = object(person);
anotherPerson.color.push("haha");
var yet = object(person);
console.log(person.color); //red, blue, haha