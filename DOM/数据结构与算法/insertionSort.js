/**
 * 
 * 插入排序
 * 每次排一个数组项
 * 以此方式构建最后的排序数组
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

        // 取得长度
        var len = array.length,
            j,
            temp;

        for (var i = 1; i < len; i++) {
            // 1.取得小段数组长度 j
            j = i;
            // 2. 取得比较模板
            temp = array[i];
            //3. 从小段数组开始遍历比较
            // 如果模板小于他的前一个项
            // 把他赋值给模板
            // 并且数组长度减一
            // 重复上面步骤，前一项的前一项，与模板比较，
            // 把它赋值给他的后一项
            // 最后最小的模板被赋值给0位
            while(j > 0 && array[j-1] > temp) {
                array[j] = array[j-1];
                j--;
            }
            array[j] = temp;
        }
    };

}

 function createNonSortedArray(size) {
     var array = new ArrayList();
     for(var i = size; i > 0; i--) {
         array.insert(i);
     }
     return array;
 }

 var array = createNonSortedArray(5);
console.log(array.toString());
array.insertionSort();
console.log(array.toString());