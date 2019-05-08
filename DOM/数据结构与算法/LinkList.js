/**
 * 
 * 链表
 * 需要一个Node辅助类，表示要加入列表的项。
 * 他包含一个element属性，即要添加到列表的值，以及一个next属性
 * 即指向列表中下一个节点的指针。
 * 
 * 他的方法：
 * append(element): 向列表尾部添加一个新项。
 * insert(position, element): 向列表的特定位置插入一个新的项。
 * remove(element): 从列表中移除一项。
 * indexOf(element): 返回元素在列表中的索引，如果列表中没有该元素返回 -1。 
 * removeAt(position): 从列表的特定位置移除一项。
 * isEmpty(): 如果链表中不包含任何元素，返回true,如果链表长度大于0，返回false。
 * size(): 返回链表包含的元素个数。
 * toString(): 由于列表项使用了Node类，就需要重写继承自js对象默认的toString方法，
 *              让其输出元素的值。
 * 
 */

function LinkList() {

    let Node = function (element) {
        this.element = element;
        this.next = null;
    };

    let length = 0;
    let head = null;

    this.append = function (element) { // 向链表尾部追加元素
        // 两种情况，列表为空，添加的是第一个元素，
        // 列表不为空，向其追加元素。

        let node = new Node(element),
        current;

        if (head == null) {
            head = node;
        } else {
            current = head;

            // 循环列表，直到找到最后一项
            while (current.next) {
                current = current.next;
            }

            // 找到最后一项，将其next赋值为node,建立连接
            current.next = node;
        }

        // 更新列表的长度
        length++;
    };

    this.insert = function (position, element) { // 在任意位置插入元素

        // 越界检查
        if (position >= 0 && position <= length) {

            let node = new Node(element),
            current = head,
            previous,
            index = 0;

            if (position === 0) {  // 在第一个位置添加
                
                node.next = current;
                head = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }

            length++;  // 更新列表的长度
            
            return true;
        } else {
            return false;
        }
    };

    this.removeAt = function (position) { // 从链表中移除元素

        // 检查越界
        if (position > -1 && position < length) {
            let current = head,
            previous,
            index = 0;

            // 移除第一项
            if (position === 0) {
                head = current.next;
            } else {
                
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }

                // 将pervious与current的下一项链接起来：跳过current,从而移除他
                previous.next = current.next;
            }

            length--;

            return current.element;
        } else {
            return null;
        }
    };

    this.remove = function (element) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    };

    this.indexOf = function (element) { // 查询元素的位置

        let current = head,
        index = 0;

        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }

        return -1;
    };

    this.isEmpty = function () {

        // 没有元素返回true, 否则返回false
        return length === 0;
    };

    this.size = function () {
        return length;
    };

    this.getHead = function () {
        return head;
    };

    this.toString = function () {

        let current = head;
        string = '';

        while (current) {
            string += current.element + (current.next ? 'n' : '');
            current = current.next;
        }
        return string;
    };
}