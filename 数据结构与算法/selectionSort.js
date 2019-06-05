/**
 * 
 * 选择排序，找到数组结构中的最小值，并将其放在第一位，接着
 * 找到第二个最小值，放到第二位，以此类推
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

    this.selectionSort = function() {
        var len = array.length;
        var minIndex;
        for (var i = 0;i < len-1; i++){
            minIndex = i;
            for (var j = i; j < len; j++) {
                if (array[minIndex] > array[j]) {
                    minIndex = j;
                }
                if(i !== minIndex) {
                    [array[i], array[minIndex]] = [array[minIndex], array[i]];
                }
            }
        }
    };
}

function createNonSortedArray(size) {
    var array = new ArrayList();
    for (var i = size; i > 0; i--) {
        array.insert(i);
    }
    return array;
}

var array = createNonSortedArray(5);
console.log(array.toString());
array.selectionSort();
console.log(array.toString());