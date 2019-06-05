// 全局模块
var myModule = (function (jQ, _) {

    function privateMethod1() {
        jQ('.container').html('test');
    }

    function privateMethod2() {
        console.log(_.min([10, 5, 100, 2, 1000]));
    }

    return  {
        publicMethod: function() {
            privateMethod1();
        }
    };

    // 引入jQuery 和 Underscore
})(jQuery, _);

myModule.publicMethod();

