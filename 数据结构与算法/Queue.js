/**
 * 队列数据结构
 * 
 * 先进先出
 * enqueue(element(s)) : 向队列尾部元素添加一个或多个新的项。
 * dequeue(): 移除队列的第一（即排在队列最前面的）项，并返回被移除的项。
 * front() : 返回队列中第一个元素--最先被添加。也将是最先被移除的元素。队列不做任何变动
 *           （不移除元素，只返回元素信息--与Stack类的peek方法非常类似）。
 * isEmpty() : 如果队列中不包含任何元素，返回true,否则返回false。
 * size()： 返回队列包含的元素个数。
 * 
 */

 function Queue () {
     let items = [];

     this.enqueue = function (element) {
         //将元素添加到数组的末尾。
         items.push(element);
     };

     this.dequeue = function () {
         //移除数组中的0位索引的值，也就是第一项。
         //unshift() 方法直接把数值插到数组的首位
         return items.shift();
     };

     this.front = function () {
         return items[0];
     };

     this.isEmpty = function () {
         return items.length == 0;
     };

     this.size = function (){
         return items.length;
     };

     this.print = function () {
         console.log(items.toString);
     };
 }

 //关于击鼓传花的游戏

 function hotPotato (nameList, num) {
     let queue = new Queue();

     for (let i = 0; i < nameList.length; i++) {
         queue.enqueue(nameList[i]);
     }

     let outer = '';
     while (queue.size() > 1) {
        for (let i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }

        outer = queue.dequeue();
        console.log(outer + '在击鼓传花中淘汰。');
     }
     return queue.dequeue();
 }

 let names = ['a', 'b', 'c', 'd', 'e', 'f'];
 let winner = hotPotato(names, 10);
 console.log('The winner is: ' + winner);