/**
 * 关于冲突解决的1. 分离链接 
 * 同时需要LinkList实例辅助
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

function HashMap () {

    var table = [];

    var loseHashCode = function (key) { // 散列函数，他是HashTable类中的一个私有方法
        var hash = 0;
        for (var i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };

    var ValuePair = function (key, value) { // 新的辅助类，表示将要加入LinkList实例的元素。
        this.key = key;
        this.value = value;

        this.toString = function () {
            return "[" + this.key + " - " + this.value + "]";
        }
    };

    this.put = function (key, value) {
        var position = loseHashCode(key);

        if (table[position] == undefined) {
            table[position] = new LinkList();
        }
        table[position].append(new ValuePair(key, value));
    };

    this.get = function (key) {
        var position = loseHashCode(key);

        if (table[position] !== undefined) {

            // 遍历链表来寻找 键、值
            var current = table[position].getHead();

            while (current.next) {
                if (current.element.key === key) {
                    return current.element.value;
                }
                current = current.next;
            }

            // 检查元素在链表第一个或最后一个节点的情况
            if (current.element.key === key) {
                return current.element.value;
            }
        }
        return undefined;
    };

    this.remove = function (key) {
        var position = loseHashCode(key);

        if (table[position] !== undefined) {
            
            var current = table[position].getHead();
            while (current.next) {
                if (current.element.key === key) {
                    table[position].remove(current.element);
                    if (table[position].isEmpty()) {
                        table[position] = undefined;
                    }
                    return true;
                }
                current = current.next;
            }

            // 检查是否为第一个或最后一个元素
            if (current.element.key === key) {
                table[position].remove(current.element);
                if (table[position].isEmpty()) {
                    table[position] = undefined;
                }
                return true;
            }
        }

        return false;
    };

    // -----------------
    // 线性探查
    this.put = function(key, value) {
        var position = loseHashCode(key);

        if (table[position] == undefined) {
            table[position] = new ValuePair(key, value);
        } else {
            var index = ++position;
            while (table[index] != undefined) {
                index++;
            }
            table[index] = new ValuePair(key, value);
        }
    };

    this.get = function (key) {
        var position = loseHashCode(key);

        if (table[position] !== undefined) {
            if (table[position].key === key) {
                return table[position].value;
            } else {
                var index = ++position;
                while (table[index] === undefined || table[index].key != key) {
                    index++;
                }
                if (table[index].key === key) {
                    return table[index].value;
                }
            }
        }
        return undefined;
    };

    this.remove = function (key) {
        var position = loseHashCode(key);

        if (table[position] !== undefined) {
            if (table[position].key === key) {
                table[position] = undefined;
            } else {
                var index = ++position;
                while (table[index] === undefined || table[index].key != key) {
                    index++;
                }
                if (table[index].key === key) {
                    table[position] = undefined;
                }
            }
        }
        return undefined;
    };
}