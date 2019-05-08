function Person(){};
Person.prototype = {
    //这种情况下[[Enmuerable]]特性会设置成true
    //默认是不可以枚举的
    // constructor: Person,
    name: 'lili',
    sayName: function(){
        console.log(this.name);
    }
};
//重设构造函数，使用与ES5兼容浏览器
Object.defineProperty(Person.prototype, "constructor", {
    enumerable: false,
    value: Person
});