function MinCoinChange(coins) {  // 在找零的时候可以使用的面额，一个数组对象
    var coins = coins;
    var cache = {};

    this.makeChange = function(amount) {  // 需要找零的数值 amount
        var me = this;
        if (!amount) {  // 如果amount不为正，就返回一个空数组。
            return [];
        }
        if (cache[amount]) {  // 检查缓存，如果结果已经存在则直接返回结果，否则，执行算法。
            return cache[amount];
        }

        var min = [], newMin, newAmount;
        for (var i = 0; i < coins.length; i++) {  // 基于面额解决问题，因此，对于每个面额，我们都得计算newAmount的值。
            var coin = coins[i];
            newAmount = amount -coin;  // newAmount 的值会一直减小，直到能找零的最小钱数。
            if (newAmount >= 0) {
                newMin = me.makeChange(newAmount);  // 若 newAmount 是合理的值（正值），我们也会计算它的找零结果。
            }
            if (newAmount >= 0 &&   // 最后判断 newAmount 是否有效
                (newMin.length < min.length-1 || !min.length) &&   // minValue(最少硬币数)是否是最优解
                (newMin.length || !newAmount)  // 与此同时minValue和newAmount是否是合理的值。
                ) {
                min = [coin].concat(newMin);  // 若以上都成立，意味着有一个比之前更优的答案。
                console.log('new Min ' + min + ' for ' + amount);
            }
        }
        return (cache[amount] = min);  //返回最终结果。 
    };
}

var minCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange.makeChange(6));