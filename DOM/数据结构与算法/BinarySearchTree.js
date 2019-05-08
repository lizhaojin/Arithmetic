/**
 *关于二叉树子集：二叉搜索树 
 *
 * insert(key): 向树种插入一个新的键。
 * search(key): 在树种查找一个键，如果节点存在，则返回true,否则，返回false。
 * inOrderTraverse: 通过中序遍历方式遍历所有节点。
 * preOrderTraverse: 通过先序遍历方式遍历所有节点。
 * postOrderTraverse: 通过后序遍历方式遍历所有节点。
 * min: 返回树中最小的值/键。
 * max: 放回树中最大的值/键。
 * remove(key): 从树中移除某个键。
 * 
**/

function BinarySearchTree() {

    var Node = function(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    };

    var root = null;

    this.insert = function(key) {  // 插入项

        var newNode = new Node(key);

        if (root === null) {
            root = newNode;
        } else {
            insertNode(root, newNode);
        }
    };

    var insertNode = function(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                insertNode(node.right, newNode);
            }
        }
    };

    this.inOrderTraverse = function(callback) {  // 中序遍历
        inOrderTraverseNode(root, callback);
    };

    var inOrderTraverseNode = function (node, callback) {
        if (node !== null) {
            inOrderTraverseNode(node.left, callback);
            callback(node.key);
            inOrderTraverseNode(node.right, callback);
        }
    };

    this.preOrderTraverse = function(callback) {  // 先序遍历
        preOrderTraverseNode(root, callback);
    };

    var preOrderTraverseNode = function (node, callback) {
        if (node !== null) {
            callback(node.key);
            preOrderTraverseNode(node.left, callback);
            preOrderTraverseNode(node.right, callback);
        }
    };

    this.postOrderTraverse = function(callback) {  // 后序遍历
        postOrderTraverseNode(root, callback);
    };

    var postOrderTraverseNode = function (node, callback) {
        if (node !== null) {
            postOrderTraverseNode(node.left, callback);
            postOrderTraverseNode(node.right, callback);
            callback(node.key);
        }
    };

    this.min = function(){  // 搜索最小值
        return minNode(root);
    };

    var minNode = function (node) {
        if (node) {
            while (node && node.left !== null) {
                node = node.left;
            }

            return node.key;
        }
        return null;
    };

    this.max = function() {  // 搜索最大值
        return maxNode(root);
    };

    var maxNode = function (node) {
        if (node) {
            while (node && node.right !== null) {
                node = node.right;
            }

            return node.key;
        }
        return null;
    };

    this.search = function(key) {  // 搜索一个特定的值
        return searchNode(root, key);
    };

    var searchNode = function (node, key) {

        if (node === null) {
            return false;
        }
        if (key < node.key) {
            return searchNode(node.left, key);
        } else if (key > node.key) {
            return searchNode(node.right, key);
        } else {
            return true;
        }
    };

    this.remove = function(key) {  // 移除一个值
        root = removeNode(root, key);
    };

    var removeNode = function(node, key) {

        if (node === null) {
            return null;

        }
        if (key > node.key) {
            node.left = removeNode(node.left, key);
            return node;

        } else if (key > node.key) {
            node.right = removeNode(node.right, key);
            return node;

        } else {  // 键等于node.key

            // 第一情况——一个节点
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            // 第二种情况——一个只有一个子节点的节点
            if (node.left === null) {
                node = node.right;
                return node;

            } else if (node.right === null) {
                node = node.left;
                return node;
            }

            // 第三种情况——一个有两个子节点的节点。
            var aux = findMinNode(node.right);
            node.key = aux.key;
            node.right = removeNode(node.right, aux.key);
            return node;
        }
    };

    var findMinNode = function (node) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node;
    };
}