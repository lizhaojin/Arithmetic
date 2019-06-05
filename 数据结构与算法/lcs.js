/**
 * 找出两个字符串序列的最长子序列的长度
 * 最长子序列是指：在两个字符串序列中以相同顺序出现，
 * 但不要求连续（非字符串子串）的字符串序列。
 * 
 * @param {*} wordX 
 * @param {*} wordY 
 */
function lcs(wordX, wordY) {
    var m = wordX.length,
    n = wordY.length;
    l = [];
    i, j, a, b;

    for (i = 0; i <= m; ++ i) {
        l[i] = [];
        solution[i] = [];

        for (j = 0; j <= n; ++j) {
            l[i][j] = 0;
        }
    }

    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) {
            if (i == 0 || j == 0) {
                l[i][j] = 0;
            } else if (wordX[i-1] == wordY[j-1]) {
                l[i][j] = l[i-1][j-1] + 1;
            } else {
                a = l[i-1][j];
                b = l[i][j-1];
                l[i][j] = (a > b) ? a : b;
            }
        }
    }
    return l[m][n];
}

