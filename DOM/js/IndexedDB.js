var indexedDB = widnow.indexedDB || window.msIndexedDB || window.mozIndexedDB ||
widow.webkitIndexedDB;

var request, database;

// 调用indexDB.open()会返回一个IDBRequest对象,在这个对象上可以添加onerror 和 onsuccess时间处理程序。
request = indexedDB.open("admin");  

request.onerror = function (event) {  // 这两个时间处理程序中，event.target都指向request对象。
    console.log("Something bad happend while trying to open: " +
        event.target.errorCode);
};
request.onsuccess = function (event) {
    database = event.target.result;
};
