function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);

    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(null, finalArgs);
    };
}

function add(a, b) {
    return a+b;
}

var curriedAdd = curry(add, 5);
console.log(curriedAdd(3));