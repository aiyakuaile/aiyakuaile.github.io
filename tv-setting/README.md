# H5表单页面生成器

这是一个简单的H5表单页面生成器，支持三种类型的表单元素（开关、下拉框和输入框），并能够将表单数据下载为JSON文件。

## 功能特点

- 支持四种表单元素类型：
  - 输入框（Input）
  - 下拉框（Select）
  - 开关（Switch）
  - 可排序数组（Sortable Array）- 支持拖拽排序
- 表单数据可以下载为JSON文件
- 响应式设计，适配不同设备
- 简洁美观的UI界面

## 使用方法

1. 打开`index.html`文件即可使用表单
2. 填写表单数据
3. 点击"下载数据"按钮，将表单数据下载为JSON文件

## 自定义表单

要自定义表单字段，请编辑`script.js`文件中的以下部分：

```javascript
// 添加表单字段
formBuilder
    .addInputField(
        'name',
        '姓名',
        '请输入您的姓名',
        '张三',
        ''
    )
    // 添加更多字段...
```

### 添加输入框

```javascript
.addInputField(
    'field_id',        // 字段ID
    '字段标签',         // 显示的标签
    '字段描述',         // 描述文本
    '占位文本',         // 输入框占位符
    '默认值'            // 默认值
)
```

### 添加下拉框

```javascript
.addSelectField(
    'field_id',        // 字段ID
    '字段标签',         // 显示的标签
    '字段描述',         // 描述文本
    [
        { value: 'value1', label: '选项1' },
        { value: 'value2', label: '选项2' },
        // 更多选项...
    ],
    'value1'            // 默认选中的值
)
```

### 添加开关

```javascript
.addSwitchField(
    'field_id',        // 字段ID
    '字段标签',         // 显示的标签
    '字段描述',         // 描述文本
    true                // 默认状态（true为开启，false为关闭）
)
```

### 添加可排序数组

```javascript
.addSortableArrayField(
    'field_id',        // 字段ID
    '字段标签',         // 显示的标签
    '字段描述',         // 描述文本
    '输入项占位文本',    // 输入框占位符
    ['默认值1', '默认值2'] // 默认值数组
)
```

## 项目结构

- `index.html` - 主HTML文件
- `styles.css` - CSS样式文件
- `script.js` - JavaScript逻辑文件

## 技术说明

- 纯原生JavaScript实现，无需任何框架
- 使用ES6类进行封装
- 使用Blob API实现文件下载功能