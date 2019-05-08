/**
 * 给定一个固定大小，能够携带重W的背包
 * 以及一组有价值和重量的物品，找出一个最佳解决方案
 * 是的装入背包的物品重量不超过W,且总价值最大。
 * 
 * @param {约束(W)} capacity
 * @param {重量} weights 
 * @param {价值} values 
 * @param {*} n 
 */

function knapSack(capacity, weights, values, n) {

    var i, w, a, b, kS = [];

    for (i = 0; i <= n; i++) { // 初始化将用于寻找解决方案的矩阵kS[n+1][capaxity+1]
        kS[i] = [];
    }

    for (i = 0; i <= n; i++) {
        for (w =0; w <= capacity; w++) {
            if (i == 0 || w == 0) { // 忽略矩阵的第一列和第一行，只处理索引不为0的列和行
                kS[i][w] = 0;
            } else if 
            // 物品 i 的重量必须小于约束（capacity）才有可能成为解决方案的一部分
            // 否则重量就会超过背包能够携带的重量，这是不可能发生的。
            // 发生这种情况是，只要忽略他，用之前的值就可以了。
            (weights[i-1] <= w) { 
                a = values[i-1] + kS[i-1][w-weights[i-1]];
                b = kS[i-1][w];
                kS[i][w] = (a > b) ? a : b; // 当找到可以构成解决方案的物品是，选择价值最大的那个。
            } else {
                kS[i][w] = kS[i-1][w]; // 最后，问题的解决方案就在这个二维表格右下角的最后一个格子里。
            }
        }
    }

    function findValues (n, capacity, kS, weights, values) {
        var i = n, k = capacity;

        console.log("解决方案包含以下物品：");

        while (i > 0 && k > 0) {
            if (kS[i][k] !== kS[i-1][k]) {
                console.log('物品' + i + ', 重量： ' + weights[i-1] + ', 价值： ' + values[i-1]);
                i--;
                k = k - kS[i][k];
            } else {
                i--;
            }
        }
    }
    findValues(n, capacity, kS, weights, values);

    return ('总价值：' + kS[n][capacity]);
}

var values = [3, 4, 5],
    weights = [2, 3, 4],
    capacity = 5,
    n = values.length;
console.log(knapSack(capacity, weights, values, n));