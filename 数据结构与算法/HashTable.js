/**
 * 散列表（哈希表）
 * 
 * put(key, value): 向散列表增加一个新的项（也能更新散列表）。
 * remove(key): 根据键值从散列表中移除值。
 * get(key): 返回根据键值检索到的特定的值。
 * 
**/

function HashTable () {
    var table = [];

    var loseHashCode = function (key) { // 散列函数，他是HashTable类中的一个私有方法
        var hash = 0;
        for (var i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };

    this.put = function (key, value) {
        var position = loseHashCode(key);
        console.log(position + ' - ' + key);
        table[position] = value;
    };

    this.get = function (key) {
        return table[loseHashCode(key)];
    };

    this.remove = function (key) {
        table[loseHashCode(key)] = undefined;
    };
}

var hash = new HashTable();
hash.put("Gad", "gad@sina.cn");
hash.put("John", "johe@163.com");
console.log(hash.get("Gad"));
console.log(hash.get("jhon"));
console.log(hash.get("Jhon"));