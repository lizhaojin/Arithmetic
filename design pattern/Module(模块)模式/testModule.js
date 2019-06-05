var testModule  = (function() {

    var counter = 0;

    return {

        incrementCounter: function() {
            return ++counter;
        },

        resetCounter: function() {
            console.log(counter);
            counter = 0;
        }
    };
    
})();