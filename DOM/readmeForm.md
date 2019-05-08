## 关于表单

### 1 表单基础知识
    表单是<form> 元素表示，对应的是HTMLFormElement类型，继承了HTMLElement

    HTMLFormElement 也有它自己下列独有的属性和方法：
         acceptCharset ：服务器能够处理的字符集；等价于 HTML 中的 accept-charset 特性。
         action ：接受请求的 URL；等价于 HTML 中的 action 特性。
         elements ：表单中所有控件的集合（ HTMLCollection ）。
         enctype ：请求的编码类型；等价于 HTML 中的 enctype 特性。
         length ：表单中控件的数量。
         method ：要发送的 HTTP 请求类型，通常是 "get" 或 "post" ；等价于 HTML 的 method 特性。
         name ：表单的名称；等价于 HTML 的 name 特性。
         reset() ：将所有表单域重置为默认值。
         submit() ：提交表单。
         target ：用于发送请求和接收响应的窗口名称；等价于 HTML 的 target 特性

    通过 document.forms 可以取得页面中所有表单，
    在此集合中，可以通过 数值索引 或 name 值 来取得特定表单

#### 1.1 提交表单
    <input><button>都可以定义提交按钮
    只要 type="submit"
    在图像为按钮时：<input> 的type 定义为"image"

    <!-- 通用提交按钮 -->
    <input type="submit" value="Submit Form">

    <!-- 自定义提交按钮 -->
    <button type="submit">Submit Form</button>

    <!-- 图像按钮 -->
    <input type="image" src="graphic.gif">

#### 1.2 重置表单
    type="reset"<input><button>

#### 1.3 表单字段
    每个表单<form> 都有一个 elements 属性
    可以按照 位置 和 name 特性 来访问他们

##### 1.3.1 共有的表单字段属性
        除了<fieldset>元素外，所有的表单都拥有相同一组属性：
             disabled ：布尔值，表示当前字段是否被禁用。
             form ：指向当前字段所属表单的指针；只读。
             name ：当前字段的名称。
             readOnly ：布尔值，表示当前字段是否只读。
             tabIndex ：表示当前字段的切换（tab）序号。
             type ：当前字段的类型，如 "checkbox" 、 "radio" ，等等。
             value ：当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包含着文件
            在计算机中的路径。

            除了<fieldset>外，所有的表单都有 type 属性
            对于 <input> 元素，这个值等于 HTML 特性 type 的值。
            对于其他元素:
                 说 明                          HTML示例                                   type属性的值
                单选列表                 <select>...</select>                             "select-one"
                多选列表                <select multiple>...</select>                    "select-multiple"
                自定义按钮                <button>...</button>                                "submit"
                自定义非提交按钮       <button type="button">...</button>                     "button"
                自定义重置按钮           <button type="reset">...</buton>                       "reset"
                自定义提交按钮           <button type="submit">...</buton>                     "submit"

##### 1.3.2 共有的表单字段方法
    每个表单字段都有2个方法：
        focus() / blur()

#### 1.4 文本框脚本
    2中文本框：
    <input> <textarea>  type="text"
    size 特性可以指定文本框能够显示的字符数
    value 特性可以设置文本框的初始值
    maxlength 特性用于文本框可以接受的最大字符数

    <textarea>
    rows 特性 指定文本框的字符行数
    cols 特性 指定字符列数

##### 1.4.1 选择文本
    select() 方法
    用于选择文本框中的所有文本
    对应的是 select 事件