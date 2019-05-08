/**
 * 
 * 冒泡排序法
 * 比较两个相邻的项，第一个比第二个打，则交换他们
 * 通过内循环中减去外循环的次数，减少不必要的比较
 * bubbleSort
 * 他的复杂度为 O(n的二次方);
 * 
 */

function ArrayList() {

    var array = [];
    
    this.insert = function(item) {
        array.push(item);
    };

    this.toString = function() {
        return array.join();
    };

    this.bubbleSort = function() {
        var length = array.length;
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length-1; j++) {
                if (array[j] > array[j+1]) {
                    [array[j], array[j+1]] = [array[j+1], array[j]];
                }
            }
        }
    };
}
// function swap(array, index1, index2) {
//     var temp = array[index1];
//     array[index1] = array[index2];
//     array[index2] = temp;

//     es6写法
//     [array[index1], array[index2]] = [array[index2], array[index1]];
// }

function createNonSortedArray(size) {
    var array = new ArrayList();
    for(var i = size; i > 0; i--) {
        array.insert(i);
    }
    return array;
}

var array = createNonSortedArray(5);
console.log(array.toString());
array.bubbleSort();
console.log(array.toString());