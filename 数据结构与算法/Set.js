/**
 * 集合: 无序不重复，是一组不同对象的集合
 * 
 * add(value): 向集合添加一个新的项
 * delete(value): 从集合移除一个值
 * has(value): 如果值在集合中，返回true,否则 false.
 * clear(): 移除集合中的所有项。
 * size(): 返回集合所包含元素的数量。
 * values(): 返回一个包含集合中所有值的数组。
 * 
**/

function Set () {
    let items = {}; // 首先是对象的集合，包含不同对象。

    this.has = function (value) {  
        // return value in items;   // 检测给定值是否是items对象的属性。

        return items.hasOwnProperty(value); // 更安全的方法
    };

    this.add = function (value) {
        if (!this.has(value)) {
            items[value] = value;
            return true;
        }
        return false;
    };

    this.remove = function (value) {
        if (this.has(value)) {
            delete items[value];
            return true;
        }
        return false;
    };

    this.clear = function () {
        items = {};
    };

    this.size = function () {

        // Object.keys() 返回一个包含给定对象所有属性的数组。
        return Object.keys(items).length;
    };

    this.values = function () {
        let values = [];
        for (let i = 0, keys=Object.keys(items); i < keys.length; i++) {
            values.push(items[keys[i]]);
        }
        return values;
    };

    this.valueLegacy = function () {
        let values = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                values.push(items[key]);
            }
        }
        return values;
    };

    this.union = function (otherSet) {  // 并集
        let unionSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }

        values = otherSet.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }

        return unionSet;
    };

    this.intersection = function (otherSet) {  // 交集
        let intersectionSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (otherSet.has(values[i])) {
                intersectionSet.add(values[i]);
            }
        }
        return intersectionSet;
    };

    this.difference = function (otherSet) {  // 差集
        let differenceSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                differenceSet.add(values[i]);
            }
        }

        return differenceSet;
    };

    this.subset = function (otherSet) {  // 子集

        if (this.size() > otherSet.size()) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                if (!otherSet.has(values[i])) {
                    return false;
                }
            }
            return true;
        }
    };

}

let setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);

let setB = new Set();
setB.add(3);
setB.add(4);

let unionAB = setA.union(setB);
console.log(unionAB.values());

