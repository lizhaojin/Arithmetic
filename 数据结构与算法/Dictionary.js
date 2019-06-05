/**
 * Map 字典他与 Set集合与链表集合不同在 ：以 键-值 对储存数据
 * 参考 java基础
 *  
 * set(key, value): 向字典中添加新元素。
 * delete(key): 通过键值移除字典中对应的数据值。
 * has(key): 如果某个键值存在于这个字典中，返回true,否则false。
 * get(key): 通过键值查找特定的值并返回。
 * clear(): 删除所有。
 * size(): 
 * keys(): 将字典中所包含的所有键名以数组形式返回。
 * values(): 将字典所包含的所有数值以数组形式返回。
**/

function Dictionary () {
    var items = {};

    this.has = function (key) {
        return key in items;
    };

    this.set = function (key, value) {
        items[key] = value;
    };

    this.delete = function (key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };

    this.get = function (key) {
        return this.has(key) ? items[key] : undefined;
    };

    this.values = function () {
        var values = [];
        for (var k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };

    this.keys = function () {
        return Object.keys(items);
    };

    this.getItems = function () {
        return items;
    };

    this.size = function () {

        // Object.keys() 返回一个包含给定对象所有属性的数组。
        return Object.keys(items).length;
    };
}

var dic = new Dictionary();
dic.set("G", "g@qq.com");
dic.set("F", "f@sian.com");
console.log(dic.getItems());