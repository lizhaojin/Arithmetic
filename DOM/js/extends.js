function SuperType(name){
    this.name = name;
    this.colors = ['red','blue','green'];
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
};

function SubType(name, age){
    //继承属性
    SuperType.call(this, name);
    this.age = age;
}
//继承方法
SubType.prototype = new SuperType();
// SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log(this.age);
};

var instance1 = new SubType('lili', 23);
instance1.colors.push('block');
console.log(instance1.colors);
instance1.sayName();
instance1.sayAge();

var instance2 = new SubType('jack', 44);
console.log(instance2.colors);
instance2.sayName();
instance2.sayAge();
