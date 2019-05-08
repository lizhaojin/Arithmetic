/**
 * 
 * js的模块模式(module pattern)
 * 为单例 创建私有变量和特权的方法
 * 单例(singleton) ：指的就是只有一个实例的对象
 * 一般js中以对象字面量的方式来创建单例对象
 * 
 */

 var singleton = {
     name: value,
     method: function() {
         //方法的代码
     }
 }

 var singleton = function() {

     //私有变量和私有函数
     var privateVariable = 10;
     
     function privateFunction() {
         return false;
     }

     //特权/公有方法和属性
     return {
         publicProperty: true,

         publicMethod: function() {
             privateVariable++;
             return privateFunction();
         }
     };
 }();