/**
 * 
 * 归并排序
 * 将原始的数组分成小数组，
 * 直到每个小数组只有一个位置
 * 接着将小数组归并成大数组
 * 
 * 采用递归
 * 复杂度O(nlog[n])
 * 
 */
function ArrayList() {
    var array = [];

    this.insert = function(item) {
        array.push(item);
    };
    this.toString = function () {
        return array.join();
    };

    this.mergeSort = function() {
        array = mergeSortRec(array);
    }

    var mergeSortRec = function(array) {
        var len = array.length;
        if (len === 1) {
            return array;
        }
        var mid = Math.floor(len / 2);
        var left = array.slice(0, mid);
        var right = array.slice(mid, len);
        return merge(mergeSortRec(left), mergeSortRec(right));
    };
    
    var merge = function(left, right) {
        var result = [];
        il = 0;
        ir = 0;
        while (il < left.length && ir < right.length) {
            if (left[il] < right[ir]) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }

        while (il < left.length) {
            result.push(left[il++]);
        }

        while (ir < right.length) {
            result.push(right[ir++]);
        }

        return result;
    };
}

function createArray(size) {
    var array = new ArrayList();
    for (var i = size; i > 0; i--) {
        array.insert(i);
    }
    return array;
}

var array = createArray(5);
console.log(array.toString());
array.mergeSort();
console.log(array.toString());