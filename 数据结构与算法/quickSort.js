/**
 * 快速排序
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

    this.quickSort = function() {
        quick(array, 0, array.length -1);
    };

    var quick = function(array, left, right) {
        var index;

        if(array.length > 1) {
            index = partition(array, left, right);

            if(left < index -1) {
                quick(array, left, index -1);
            }

            if(index < right) {
                quick(array, index, right);
            }
        }
    };

    var partition = function(array, left, right) {
        var pivot = array[Math.floor((right + left) / 2)],
        i = left,
        j = right;

        while(i <= j) {
            while(array[i] < pivot) {
                i++;
            }
            while(array[j] > pivot) {
                j--;
            }
            if(i <= j) {
                swap(array, i , j);
                i++;
                j--;
            }
        }
        return i;
    };

    function swap(array, index1, index2) {
        [array[index1], array[index2]] = [array[index2], array[index1]];
    }
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
array.quickSort();
console.log(array.toString());