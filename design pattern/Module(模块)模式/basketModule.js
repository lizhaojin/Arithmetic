var basketModule = (function() {

    var basket = [];

    function doSomePri() {
        // ...
    }

    function doElsePri() {
        // ...
    }

    return {

        // 添加 item 到购物车
        addItem: function(values) {
            basket.push(values);
        },

        // 获取购物车里的 item 数
        getItemCount: function() {
            return basket.length;
        },

        // 私有函数的公有形式别名
        doSomething: doSomePri,

        // 获取购物车里所有 item 的价值总和
        getTotal: function() {

            var itemCount = this.getItemCount(),
                total = 0;

            while (itemCount--) {
                total += basket[itemCount].price;
            }

            return total;
        }

    };

})();

basketModule.addItem({
    item: 'b',
    price: 90
});

basketModule.addItem({
    item: 'c',
    price: 0.4
});

console.log(basketModule.getItemCount());
console.log(basketModule.getTotal());