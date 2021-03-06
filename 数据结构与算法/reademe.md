## ECMAScript 6 和数组的新功能
* @@iterator  返回一个包含数组 **键值对** 的迭代器对象，可以通过同步调用得到数组元素的键值对。
* copyWithin  复制数组中一系列元素到同一数组指定的起始位置。
* entries     返回包含数组所有键值对的 @@iterator。
* includes    如果数组中存在某个元素则返回true,否则false。ES7新增。
* find        根据回调函数给定的条件从数组中查找元素，找到返回该元素。
* findIndex   返回找到元素的索引。
* fill        用静态值填充数组。
* from        根据已有数组创建一个新数组
* keys        返回包含数组所有索引的 @@iterator
* of          根据传入的参数创建一个新数组
* values      返回包含数组中所有值得 @@iterator

#### @@iterator
    ES6为Array添加的属性
    通过Symbol.iterator来访问：
        let iterator = numbers[Symbol.iterator]();
        console.log(iterator.next().value); 
    
    不断的调用迭代器的next方法，就能依次得到数组中的值。
    最后会返回undefined.

##### entries / keys / values
    从数组中得到迭代器的方法。

    - entries 返回包含 键值对的 @@iterator
        let en = numbers.entries();  //得到键值对的迭代器
        console.log(en.next().value); //[0, 1] - 位置0的值是1.

        这个方法在集合、字典、散列表中很有用。

    - keys 返回包含数组 索引的 @@iterator
        let keys = numbers.keys(); 
        console.log(keys.next()); // {value: 0, done: false}

        一旦没有可以迭代的值，返回属性为 undefined ， done属性为 true的对象。

    - values 返回数组的值，
        var val = numbers.values();
        console.log(val.next());  // {value: 1, done: false}

##### Array.from 方法
    Array.from 根据已有数组 创建一个 新数组。
        比如数组去重
        function c(array) {
            return Array.from(new Map(array));
        }

##### Array.of 方法
    根据传入参数 创建一个新数组
    let num = Array.of(1);
    let num2 = Array.of(1,2,3,4,5);
    他就等于下面代码
    let num = [1];
    let num2 = [1,2,3,4,5];

    也可以复制已有数组
    let num = Array.of(...num2);
    这里：...会吧num2数组中的值都展开成参数。

##### fill 方法
    用静态值 填充数组
    let s = Array.of(2,3,4,5);
    s.fill(0);
    console.log(s); //[0,0,0,0]

    当然可以指定索引

##### copyWithin 方法
    复制数组中的一系列元素 到 同一数组指定的 起始位置。

## Stack 栈
    后进先出 LIFO
    有序集合
    Stack.js

    注：ES6的类是基于原型的。


## Queue 队列
    美 /kju/
    先进先出 FIFO, 先来先服务。

## 链表
    链表存储有序的元素集合。
        元素
           -|
            |-存储元素本身的节点
            |-和一个指向下一个元素的引用

               node          node        null
    head -> |item|next|-> |item|next|-> |null|

    访问链表中间的一个元素，需要从 起点（表头）开始迭代列表直到找到所有的元素。

    example: LinkList.js

    双向链表： 
    区别：
        链接是双向的，一个链向下一个元素，一个链向前一个元素。
        DoublyLinkedList.js

## 集合
    Set.js

    由一组无序且唯一（即不能重复）的项组成。
    是一组不同的对象的集。

### 1.1 集合的操作
    1. 并集： 对于给定的2个集合，返回一个包含两个集合中所有元素的新集合。
    2. 交集： ................,....................共有...........。
    3. 差集： ................,返回一个包含所有存在于第一个集合 且 不存在于 第二个集合的
    元素的新集合。
    4. 子集： 验证一个给定集合是否是另一个集合的子集。

#### 1.1.1 并集 ∪
    A ∪ B
    定义:
    A∪B = { x | x ∈ A ∨ x ∈ B }
    意思： ∨(逻辑或) x(元素) 存在于A中，或 x(元素) 存在于B中。

#### 1.1.2 交集 ∩
    A ∩ B
    定义：
    A∩B = { x | x ∈ A ∧ x ∈ B }
    意思: ∧(逻辑与) x(元素) 存在于A中，且 x(元素) 存在于B中。

#### 1.1.3 差集 -
    A -B
    定义：
    A-B = { x | x ∈ A ∧ x ∉ B }
    意思: x存在于A中，且x不存在于B中。

#### 1.1.4 子集 ⊆
    A ⊆ B
    定义：
    “∀”即“全称量化符号”，是一种数学符号，用以代表全称量词。在汉语中，该符号读作“任意”。
    对所有；对任意；对任一
    ∀x { x ∈ A → x ∈ B}
    意思: 集合A中的每一个x元素，也需要存在集合B中。

## 字典和散列表
### 1. 字典
    在集合中是   【值， 值】
    而在字典中是  【键， 值】
        其中键名是用来查询特定元素的
        字典也称作 映射。

#### 1.1 创建字典
    ES中也有一个 Map 类， 也就是 我们所说的字典。
    Dictionary.js

### 2. 散列表 HashMap（非顺序数据结构）
    HashTable类 也叫 HashMap类
    是Dictionary类的一种散列表现方式。
    HashTable.js

    * 创建哈希表的时候会出现键值相同，而产生覆盖value的现象
        因此需要处理这种冲突：
            1. 分离链接
            2. 线性探查
            3. 双散列法


## 树 （非顺序数据结构）
    是一种分层数据的抽象模型
    一个树结构包含一系列存在父子关系的节点。
    位于树顶部的节点叫做 根节点，他没有父节点。

    树中的每个元素都叫做 节点。
    同时分为 外部节点 和 内部节点。

    至少有一个子节点的节点成为 内部节点。
    没有子元素的节点成为 外部节点。

    关于树的另一个术语是 子树。
    另一个是 深度，根据他拥有的父节点定义。

### 1. 二叉树和二叉搜索树
    二叉树： 最多只能有两个节点：一个在左侧的子节点
        一个在右侧的子节点。

    二叉搜索树（BST）是二叉树的一种
    只允许你在左侧节点 存储（比父节点）小的值，
    在右侧节点存储（比父节点）大（或者等于）的值。


## 图 （非线性数据结构）
    图是网络结构的抽象模型。
    有一组边连接的节点（或顶点）

    图：G = (V,E);
    V: 一组定点
    E: 一组边，连接V中的定点

    相邻顶点：由一条边连接在一起的顶点
    度：相邻顶点的数量
    路径：顶点V1,V2,...,Vk的一个连续序列
    简单路径：不包含重复的定点
    环：也是一个简单路径
    * 如果图中不存在环，则称改图是 无环的。
    * 如果图中每两个顶点间都存在路径，则称该图是连通的。

### 1. 有向图和无向图
    有向图的边有一个方向。
    如果图中两个顶点间在双向上都存在路径，则该图是 强连通的。

    图还可以是为加权的，加权的图的边被赋予了 权值。

### 2. 图的表示
#### 2.1 邻接矩阵
    每个节点都和一个整数相关联
    该整数将作为数组的索引。