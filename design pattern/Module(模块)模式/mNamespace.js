var myNamespace = (function(){

    var myPrivateVar = 0;

    var myPrivateMethod = function(foo) {
        console.log(foo);
    };

    return {

        myPublicVar: 'foo',

        myPublicFunc: function(bar) {

            myPrivateVar++;

            myPrivateMethod(bar);
        }
    };
    
})();