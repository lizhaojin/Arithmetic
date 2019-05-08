function MyObject() {
    //私有变量和私有函数
    var privateVariable = 10;

    function privateFunction() {
        return false;
    }

    //特权方法
    this.publicMethod = function () {
        privateVariable++;
        return privateFunction();
    };
}
