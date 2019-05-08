## Promise
    允诺

    MDN
        The Promise object is used for asynchronous computations.

        A Promise represents a value which may be available now, or in the future, or never.

        Promise 对象用于异步计算
        一个Promise 表示一个现在、将来或永不可能可用的值。

        主要用于异步计算。
        可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
        可以在对象之间出传递操作Promise,帮助我们处理队列。

### 产生的原因
    Js 为检查表单而生
    创造他的首要目标操作是DOM

### 回调有四个问题
    1. 嵌套参差很深，难以维护
    2. 无法正常使用 return 和 throw
    3. 无法正常检索堆栈信息
    4. 多个回调之间难以建立联系。

### Promise使用
    1. 先初始化一个Promise对象实例

    new Promise (
        <!-- 执行器 executor -->
        function (resolve, reject) {
            <!-- 一段好事很长的一步操作 -->

            resolve();  // 数据处理完成

            reject();  // 数据处理出错
        }
    )

    .then(function A() {
        // 成功， 下一步
    }， function B() {
        // 失败，做相应处理
    });