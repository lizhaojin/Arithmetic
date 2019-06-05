var intRomeNum = function(r) {
    let romeNum = {I:1, v:5, X:10, L:50, C:100, D:500,M:1000};
    let rArr = r.split('');
    let endArr = [];
    let pre, cur;
    
    endArr.push(romeNum[rArr[0]]);

    for (let i = 1; i < rArr.length; i++) {
        pre = endArr[endArr.length-1];
        cur = rArr[i];

        if (romeNum[cur] > pre) {
            endArr[endArr.length-1] = romeNum[cur] - pre;
        } else {
            endArr.push(romeNum[cur]);
        }
    }
    
    return endArr.reduce((sum, num) => sum + num);
};