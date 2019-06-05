// 对象字面量方法 ，一个对象被描述为一组包含在大括号 {} 中
// 以 逗号 ，  分隔的 name/value 对。

var myModule = {

    myProperty: "someValue",

    // 对象字面量可以包含属性和方法
    // 例如,可以声明模块的配置对象
    myConfig: {
        useCaching: true,
        language: "en"
    },

    // 基本方法
    myMethod: function() {
        console.log("Where is ?");
    },

    // 根据当前配置输出信息
    myMethod2: function() {
        console.log(this.myConfig.language);
    },

    // 重写当前配置
    myMethod3: function(newConfig) {

        if (typeof newConfig === "object") {
            this.myConfig = newConfig;
            console.log(this.myConfig.language);
        }
    }
};

// 输出
myModule.myMethod();
myModule.myMethod2();
myModule.myMethod3({
    language: 'ch',
    useCaching: false
});