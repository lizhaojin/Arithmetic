(function(){
    //私有变量和函数
    var privateVariable = 10;
    function privareFunction() {
        return false;
    }

    //构造函数
    //函数生命只能创建局部函数
    //初始化未经声明的变量，总会创建一个全局变量
    MyObject = function(){};

    MyObject.prototype.publicMethod = function(){
        privateVariable++;
        return privareFunction();
    };
})();