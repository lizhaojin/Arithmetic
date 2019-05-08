function DoublyLinkedList () {

    let Node = function (element) {
        this.element = element;
        this.next = null;
        this.prev = null; //相对于单项链表新增的项。
    }

    let length = 0;
    let head = null;
    let tail = null; //新增的，对列表最后一项的引用。

    this.insert = function (position, element) { // 在任意位置插入新元素

        // 检查越界
        if (position >= 0 && position <= length) {
            
            let node = new Node(element),
            current = head,
            previous,
            index = 0;

            if (position === 0) { // 在列表第一个位置（列表起点）插入一个元素

                if(!head) {  // 新增的，列表为空的情况下
                    head = node;
                    tail = node;
                } else { // 列表不为空的情况下，插入为第一个元素
                    node.next = current;
                    current.prev = node;  // 新增的
                    head = node;
                }
            } else if (position === length) {  //最后一项 //新增的

                current = tail;
                current.next = node;
                node.prev = current;
                tail = node;

            } else { // 在列表任意位置插入元素
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;

                current.prev = node;  // 新增的
                node.prev = previous;  // 新增的
            }

            length++;  // 更新列表的长度

            return true;
        } else {
            return false;
        }
    };

    // 从任意位置移除元素
    this.removeAt = function (position) {

        // 越界检查
        if (position > -1 && position < length) {

            let current = head,
            previous,
            index = 0;

            // 移除第一项
            if (position === 0) {

                head = current.next;

                // 如果只有一项，更新tail // 新增的
                if (length === 1) {
                    tail = null;
                } else {
                    head.prev = null;
                }
            } else if (position === length-1) {  // 最后一项  // 新增的

                current = tail;
                tail = current.prev;
                tail.next = null;
            } else {

                while (index++ < position) {

                    previous = current;
                    current = current.next;
                }

                // 将previous与current的下一项链接起来——跳过current
                previous.next = current.next;
                current.next.prev = previous;  // 新增的
            }

            length--;

            return current.element;
        } else {
            return null;
        }
    };
    
}