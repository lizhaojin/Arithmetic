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
     this.insertionSort = function() {
         var len = array.length;
         var j;
         var temp;
         for(var i = 1; i < len; i++) {
             j = i;
             temp = array[j];
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