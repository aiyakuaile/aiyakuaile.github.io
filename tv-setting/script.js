/**
 * 表单生成器类 - 用于创建和管理表单
 */
class FormBuilder {
  constructor(formContainer) {
    this.formContainer = formContainer;
    this.fields = [];
  }

  /**
   * 提示函数
   * @param {string} message - 提示信息
   * @param {string} type - 提示类型 ("success" 或 "error")
   */
  showToast(message, type = "success") {
    // 创建提示元素
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in-out";

    // 根据类型设置背景颜色
    if (type === "success") {
      toast.style.backgroundColor = "#2980b9";
    } else {
      toast.style.backgroundColor = "#e74c3c";
    }

    // 添加到页面
    document.body.appendChild(toast);

    // 渐显提示
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);

    // 3秒后移除提示
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * 添加输入框字段
   * @param {string} id - 字段ID
   * @param {string} label - 字段标签
   * @param {string} description - 字段描述
   * @param {string} placeholder - 占位文本
   * @param {string} defaultValue - 默认值
   * @returns {FormBuilder} - 返回this以支持链式调用
   */
  addInputField(
    id,
    label,
    description = "",
    placeholder = "",
    defaultValue = ""
  ) {
    this.fields.push({
      type: "input",
      id,
      label,
      description,
      placeholder,
      defaultValue,
    });
    return this;
  }

  /**
   * 添加下拉框字段
   * @param {string} id - 字段ID
   * @param {string} label - 字段标签
   * @param {string} description - 字段描述
   * @param {Array} options - 选项数组，格式为[{value: '值', label: '显示文本'}]
   * @param {string} defaultValue - 默认选中的值
   * @returns {FormBuilder} - 返回this以支持链式调用
   */
  addSelectField(id, label, description = "", options = [], defaultValue = "") {
    this.fields.push({
      type: "select",
      id,
      label,
      description,
      options,
      defaultValue,
    });
    return this;
  }

  /**
   * 添加开关字段
   * @param {string} id - 字段ID
   * @param {string} label - 字段标签
   * @param {string} description - 字段描述
   * @param {boolean} defaultValue - 默认值
   * @returns {FormBuilder} - 返回this以支持链式调用
   */
  addSwitchField(id, label, description = "", defaultValue = false) {
    this.fields.push({
      type: "switch",
      id,
      label,
      description,
      defaultValue,
    });
    return this;
  }

  /**
   * 添加可排序数组字段
   * @param {string} id - 字段ID
   * @param {string} label - 字段标签
   * @param {string} description - 字段描述
   * @param {string} itemPlaceholder - 数组项占位文本
   * @param {Array} defaultValue - 默认值数组
   * @returns {FormBuilder} - 返回this以支持链式调用
   */
  addSortableArrayField(
    id,
    label,
    description = "",
    itemPlaceholder = "",
    defaultValue = []
  ) {
    this.fields.push({
      type: "sortable-array",
      id,
      label,
      description,
      itemPlaceholder,
      defaultValue,
    });
    return this;
  }

  /**
   * 渲染表单
   */
  render() {
    this.formContainer.innerHTML = "";

    this.fields.forEach((field) => {
      const fieldElement = document.createElement("div");
      fieldElement.className = `form-field ${field.type}-field`;

      // 创建标签
      const labelElement = document.createElement("label");
      labelElement.setAttribute("for", field.id);
      labelElement.textContent = field.label;
      fieldElement.appendChild(labelElement);

      // 添加描述（如果有）
      if (field.description) {
        const descriptionElement = document.createElement("div");
        descriptionElement.className = "description";
        descriptionElement.textContent = field.description;
        fieldElement.appendChild(descriptionElement);
      }

      // 根据字段类型创建不同的输入元素
      switch (field.type) {
        case "input":
          this.renderInputField(fieldElement, field);
          break;
        case "select":
          this.renderSelectField(fieldElement, field);
          break;
        case "switch":
          this.renderSwitchField(fieldElement, field);
          break;
        case "sortable-array":
          this.renderSortableArrayField(fieldElement, field);
          break;
      }

      this.formContainer.appendChild(fieldElement);
    });
  }

  /**
   * 渲染输入框字段
   * @param {HTMLElement} container - 容器元素
   * @param {Object} field - 字段配置
   */
  renderInputField(container, field) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = field.id;
    input.name = field.id;
    input.placeholder = field.placeholder || "";
    input.value = field.defaultValue || "";
    container.appendChild(input);
  }

  /**
   * 渲染下拉框字段
   * @param {HTMLElement} container - 容器元素
   * @param {Object} field - 字段配置
   */
  renderSelectField(container, field) {
    // 创建包装容器
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "select-wrapper";

    // 创建原生select元素（用于表单数据收集）
    const select = document.createElement("select");
    select.id = field.id;
    select.name = field.id;
    select.style.display = "none"; // 隐藏原生select

    // 创建自定义下拉框UI
    const customSelect = document.createElement("div");
    customSelect.className = "custom-select";
    customSelect.setAttribute("tabindex", "0"); // 使其可聚焦

    // 创建显示选中值的元素
    const selectedValue = document.createElement("div");
    selectedValue.className = "selected-value";

    // 创建下拉选项容器
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = "custom-select-dropdown";
    dropdownContainer.style.display = "none";

    // 添加选项到原生select和自定义下拉框
    let selectedOption = null;
    field.options.forEach((option) => {
      // 添加到原生select
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      if (option.value === field.defaultValue) {
        optionElement.selected = true;
        selectedOption = option;
      }
      select.appendChild(optionElement);

      // 添加到自定义下拉框
      const customOption = document.createElement("div");
      customOption.className = "custom-select-option";
      customOption.dataset.value = option.value;
      customOption.textContent = option.label;
      if (option.value === field.defaultValue) {
        customOption.classList.add("selected");
      }

      // 点击选项时更新选中值
      customOption.addEventListener("click", () => {
        // 更新原生select的值
        select.value = option.value;

        // 更新自定义下拉框UI
        selectedValue.textContent = option.label;

        // 更新选中状态
        dropdownContainer
          .querySelectorAll(".custom-select-option")
          .forEach((opt) => {
            opt.classList.remove("selected");
          });
        customOption.classList.add("selected");

        // 关闭下拉框
        dropdownContainer.style.display = "none";

        // 触发change事件
        const event = new Event("change");
        select.dispatchEvent(event);
      });

      dropdownContainer.appendChild(customOption);
    });

    // 设置初始选中值
    if (selectedOption) {
      selectedValue.textContent = selectedOption.label;
    } else if (field.options.length > 0) {
      selectedValue.textContent = field.options[0].label;
    } else {
      selectedValue.textContent = "请选择";
    }

    // 点击自定义下拉框时显示/隐藏选项
    customSelect.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = dropdownContainer.style.display === "block";
      dropdownContainer.style.display = isVisible ? "none" : "block";
    });

    // 点击页面其他地方时关闭下拉框
    document.addEventListener("click", () => {
      dropdownContainer.style.display = "none";
    });

    // 组装自定义下拉框
    customSelect.appendChild(selectedValue);
    selectWrapper.appendChild(customSelect);
    selectWrapper.appendChild(dropdownContainer);
    selectWrapper.appendChild(select);

    container.appendChild(selectWrapper);
  }

  /**
   * 渲染开关字段
   * @param {HTMLElement} container - 容器元素
   * @param {Object} field - 字段配置
   */
  renderSwitchField(container, field) {
    const switchContainer = document.createElement("div");
    switchContainer.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = field.id;
    input.name = field.id;
    input.checked = field.defaultValue || false;

    const slider = document.createElement("span");
    slider.className = "slider";

    // 添加点击事件监听器
    slider.addEventListener("click", () => {
      input.checked = !input.checked;
      // 触发change事件，确保数据更新
      const event = new Event("change");
      input.dispatchEvent(event);
    });

    switchContainer.appendChild(input);
    switchContainer.appendChild(slider);

    // 添加开关到容器
    container.appendChild(switchContainer);
  }

  /**
   * 渲染可排序数组字段
   * @param {HTMLElement} container - 容器元素
   * @param {Object} field - 字段配置
   */
  renderSortableArrayField(container, field) {
    // 创建数组容器
    const arrayContainer = document.createElement("div");
    arrayContainer.className = "sortable-array-container";
    arrayContainer.id = `${field.id}-container`;

    // 创建项目列表
    const itemsList = document.createElement("ul");
    itemsList.className = "sortable-items-list";
    itemsList.id = field.id;

    // 添加默认项目
    if (field.defaultValue && field.defaultValue.length > 0) {
      field.defaultValue.forEach((value, index) => {
        const item = this.createSortableItem(
          field.id,
          value,
          field.itemPlaceholder,
          index
        );
        itemsList.appendChild(item);
      });
    } else {
      // 如果没有默认值，添加一个空项
      const item = this.createSortableItem(
        field.id,
        "",
        field.itemPlaceholder,
        0
      );
      itemsList.appendChild(item);
    }

    // 添加项目列表到容器
    arrayContainer.appendChild(itemsList);

    // 添加"添加项目"按钮
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-item-btn";
    addButton.textContent = "添加";
    addButton.addEventListener("click", () => {
      // 检查已存在的输入框是否有内容
      const existingInputs = itemsList.querySelectorAll(".sortable-item-input");
      let hasInvalidInput = false;
      
      for (let i = 0; i < existingInputs.length; i++) {
        const value = existingInputs[i].value.trim();
        if (!value) {
          hasInvalidInput = true;
          this.showToast("请输入订阅源后，再继续添加", "error");
          return;
        }
        
        // 检查是否为有效的URL格式
        try {
          new URL(value);
        } catch (e) {
          if (!value.startsWith('http://') && !value.startsWith('https://')) {
            this.showToast("订阅源必须是有效的URL格式（以http://或https://开头）", "error");
            hasInvalidInput = true;
            return;
          }
        }
      }
      
      if (hasInvalidInput) {
        return;
      }
      
      const newIndex = itemsList.children.length;
      const newItem = this.createSortableItem(
        field.id,
        "",
        field.itemPlaceholder,
        newIndex
      );
      itemsList.appendChild(newItem);
    });

    arrayContainer.appendChild(addButton);
    container.appendChild(arrayContainer);

    // 初始化拖拽排序功能
    this.initSortable(itemsList);
  }

  /**
   * 创建可排序项目
   * @param {string} fieldId - 字段ID
   * @param {string} value - 项目值
   * @param {string} placeholder - 占位文本
   * @param {number} index - 项目索引
   * @returns {HTMLElement} - 项目元素
   */
  createSortableItem(fieldId, value, placeholder, index) {
    const item = document.createElement("li");
    item.className = "sortable-item";
    item.draggable = true;
    item.dataset.index = index;

    // 添加拖动手柄
    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = "&#8942;&#8942;"; // 垂直省略号

    // 添加输入框
    const input = document.createElement("input");
    input.type = "text";
    input.className = "sortable-item-input";
    input.name = `${fieldId}[${index}]`;
    input.placeholder = placeholder || "";
    input.value = value || "";

    // 添加失去焦点事件监听器
    input.addEventListener("blur", (e) => {
      const value = e.target.value.trim();
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        e.target.value = '';
        // this.showToast("订阅源必须是有效的URL格式（以http://或https://开头）", "error");
      }
    });

    // 添加删除按钮
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-item-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => {
      item.parentNode.removeChild(item);
      // 重新排序索引
      this.reindexSortableItems(fieldId);
    });

    // 添加拖拽事件
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
    });

    // 组装项目
    item.appendChild(dragHandle);
    item.appendChild(input);
    item.appendChild(deleteBtn);

    return item;
  }

  /**
   * 初始化拖拽排序功能
   * @param {HTMLElement} container - 容器元素
   */
  initSortable(container) {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingItem = container.querySelector(".dragging");
      if (!draggingItem) return;

      // 获取鼠标位置下方的元素
      const afterElement = this.getDragAfterElement(container, e.clientY);

      if (afterElement) {
        container.insertBefore(draggingItem, afterElement);
      } else {
        container.appendChild(draggingItem);
      }
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      const fieldId = container.id;
      this.reindexSortableItems(fieldId);
    });
  }

  /**
   * 获取拖拽后的位置元素
   * @param {HTMLElement} container - 容器元素
   * @param {number} y - 鼠标Y坐标
   * @returns {HTMLElement} - 位置元素
   */
  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".sortable-item:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  /**
   * 重新索引可排序项目
   * @param {string} fieldId - 字段ID
   */
  reindexSortableItems(fieldId) {
    const container = document.getElementById(fieldId);
    if (!container) return;

    const items = container.querySelectorAll(".sortable-item");
    items.forEach((item, index) => {
      item.dataset.index = index;
      const input = item.querySelector("input");
      if (input) {
        input.name = `${fieldId}[${index}]`;
      }
    });
  }

  /**
   * 获取表单数据
   * @returns {Object} - 表单数据对象
   */
  getData() {
    const data = {};

    this.fields.forEach((field) => {
      if (field.type === "sortable-array") {
        // 处理可排序数组
        const container = document.getElementById(field.id);
        if (container) {
          const items = container.querySelectorAll(".sortable-item-input");
          // 过滤掉空字符串，只保留有内容的项
          data[field.id] = Array.from(items)
            .map((input) => input.value.trim())
            .filter((value) => value !== "");
        }
      } else {
        // 处理其他类型
        const element = document.getElementById(field.id);
        if (element) {
          switch (field.type) {
            case "input":
            case "select":
              data[field.id] = element.value;
              break;
            case "switch":
              data[field.id] = element.checked;
              break;
          }
        }
      }
    });

    return data;
  }

  /**
   * 使用数据初始化表单
   * @param {Object} data - 要设置的数据
   * @returns {boolean} - 初始化是否成功
   */
  initializeWithData(data) {
    if (!data || typeof data !== "object") {
      console.error("初始化数据无效:", data);
      return false;
    }

    try {
      // 遍历所有字段进行初始化
      this.fields.forEach((field) => {
        // 检查数据中是否有对应的字段值
        if (data[field.id] === undefined) return;

        if (field.type === "sortable-array") {
          // 处理可排序数组
          const container = document.getElementById(field.id);
          if (!container) return;

          // 清空现有项目
          const existingItems = container.querySelectorAll(".sortable-item");
          existingItems.forEach((item) => item.remove());

          // 添加新项目
          if (Array.isArray(data[field.id])) {
            data[field.id].forEach((value, index) => {
              const newItem = this.createSortableItem(
                field.id,
                value,
                field.itemPlaceholder,
                index
              );
              container.appendChild(newItem);
            });
            this.reindexSortableItems(field.id);
          }
        } else {
          // 处理其他类型
          const element = document.getElementById(field.id);
          if (!element) return;

          switch (field.type) {
            case "input":
              element.value = data[field.id];
              break;
            case "select":
              element.value = data[field.id];

              // 如果使用了自定义下拉框，也需要更新显示值
              const selectWrapper = element.closest(".select-wrapper");
              if (selectWrapper) {
                const selectedValue =
                  selectWrapper.querySelector(".selected-value");
                const options = field.options || [];
                const selectedOption = options.find(
                  (opt) => String(opt.value) === String(data[field.id])
                );
                if (selectedValue && selectedOption) {
                  selectedValue.textContent = selectedOption.label;
                }

                // 更新选中状态
                const customOptions = selectWrapper.querySelectorAll(
                  ".custom-select-option"
                );
                customOptions.forEach((opt) => {
                  if (String(opt.dataset.value) === String(data[field.id])) {
                    opt.classList.add("selected");
                  } else {
                    opt.classList.remove("selected");
                  }
                });
              }
              break;
            case "switch":
              element.checked = !!data[field.id];
              break;
          }
        }
      });

      return true;
    } catch (error) {
      console.error("初始化表单数据失败:", error);
      return false;
    }
  }
}

/**
 * 工具类 - 用于数据操作
 */
class DataUtils {
  /**
   * 将数据下载为JSON文件
   * @param {Object} data - 要下载的数据
   * @param {string} filename - 文件名
   */
  static downloadJSON(data, filename = "data.json") {
    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(data, null, 2);

    // 创建Blob对象
    const blob = new Blob([jsonString], { type: "application/json" });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * 复制JSON数据到剪贴板
   * @param {Object} data - 要复制的数据
   * @returns {Promise<boolean>} - 复制是否成功
   */
  static async copyJSONToClipboard(data) {
    try {
      // 将数据转换为JSON字符串
      const jsonString = JSON.stringify(data, null, 2);

      // 使用Clipboard API复制到剪贴板
      await navigator.clipboard.writeText(jsonString);

      return true;
    } catch (error) {
      console.error("复制到剪贴板失败:", error);
      return false;
    }
  }

  /**
   * 从剪贴板读取JSON数据
   * @returns {Promise<Object|null>} - 解析后的JSON数据或null
   */
  static async getJSONFromClipboard() {
    try {
      // 从剪贴板读取文本
      const text = await navigator.clipboard.readText();

      // 尝试解析JSON
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error("从剪贴板读取JSON失败:", error);
      return null;
    }
  }
}

// 当DOM加载完成后初始化表单
document.addEventListener("DOMContentLoaded", () => {
  // 获取表单容器
  const formContainer = document.getElementById("formFields");

  // 创建表单生成器实例
  const formBuilder = new FormBuilder(formContainer);

  // 添加表单字段
  formBuilder
    .addSortableArrayField(
      "channels",
      "订阅源",
      "请添加http(s)://订阅源链接，可拖动调整顺序，排在第一个的位置的源，默认为使用中",
      "输入订阅源链接",
      []
    )
    .addSelectField(
      "dataValueProxy",
      "数据代理",
      "Github访问受限的用户需开启",
      [
        { value: 0, label: "关闭" },
        { value: 1, label: "代理1" },
        { value: 2, label: "代理2" },
      ],
      1
    )
    .addSelectField(
      "timeoutSwitchLine",
      "超时自动切换线路",
      "超过多少秒未播放则自动切换下一个线路",
      [
        { value: 5, label: "5s" },
        { value: 10, label: "10s" },
        { value: 15, label: "15s" },
        { value: 20, label: "20s" },
        { value: 30, label: "30s" },
        { value: 60, label: "60s" },
      ],
      15
    )
    .addSwitchField(
      "leftRightSelect",
      "上下键切换频道(仅TV版可用)",
      "开启后原先的设置页面和线路选择页面改成左右键打开",
      true
    )
    .addSelectField(
      "fontScale",
      "字体大小",
      "字体的放大倍数,请选择合适的缩放进行调整",
      [
        { value: 1.0, label: "1x" },
        { value: 1.2, label: "1.2x" },
        { value: 1.4, label: "1.4x" },
        { value: 1.6, label: "1.6x" },
        { value: 1.8, label: "1.8x" },
        { value: 2.0, label: "2x" },
      ],
      1.0
    )
    .addSelectField(
      "appFontFamily",
      "字体",
      "支持使用自定义字体美化显示效果",
      [
        {
          value: JSON.stringify({
            id: "0",
            font_name: "系统",
            font_key: "system",
            font_type: "ttf",
          }),
          label: "系统",
        },
        {
          value: JSON.stringify({
            id: "1",
            font_name: "楷体",
            font_key: "kaiti",
            font_type: "ttf",
          }),
          label: "楷体",
        },
        {
          value: JSON.stringify({
            id: "2",
            font_name: "丸子体",
            font_key: "wanzi",
            font_type: "ttf",
          }),
          label: "丸子体",
        },
        {
          value: JSON.stringify({
            id: "3",
            font_name: "骚包体",
            font_key: "saobao",
            font_type: "otf",
          }),
          label: "骚包体",
        },
        {
          value: JSON.stringify({
            id: "4",
            font_name: "文艺体",
            font_key: "wenyi",
            font_type: "ttf",
          }),
          label: "文艺体",
        },
        {
          value: JSON.stringify({
            id: "5",
            font_name: "小薇体",
            font_key: "xiaowei",
            font_type: "otf",
          }),
          label: "小薇体",
        },
        {
          value: JSON.stringify({
            id: "6",
            font_name: "微软雅黑",
            font_key: "yahei",
            font_type: "ttf",
          }),
          label: "微软雅黑",
        },
        {
          value: JSON.stringify({
            id: "7",
            font_name: "汉仪正圆",
            font_key: "HYZY",
            font_type: "ttf",
          }),
          label: "汉仪正圆",
        },
      ],
      JSON.stringify({
        id: "0",
        font_name: "系统",
        font_key: "system",
        font_type: "ttf",
      })
    )
    .addSwitchField(
      "bingBg",
      "背景美化",
      "未播放时的屏幕背景,每日更换图片",
      false
    )
    .addSwitchField(
      "autoUpdate",
      "自动更新",
      "发现新版本将会自动下载并安装",
      false
    )
    .addSwitchField(
      "lightVersionCheck",
      "更新提示免打扰",
      "开启后,播放页面的更新弹窗将会变成普通的消息提醒",
      true
    );

  // 渲染表单
  formBuilder.render();

  // 绑定下载按钮事件
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.addEventListener("click", () => {
    // 检查是否至少添加了一个订阅源
    const channelsContainer = document.getElementById("channels");
    if (channelsContainer) {
      const channelInputs = channelsContainer.querySelectorAll(".sortable-item-input");
      let hasValidChannel = false;
      
      for (let i = 0; i < channelInputs.length; i++) {
        if (channelInputs[i].value.trim()) {
          hasValidChannel = true;
          break;
        }
      }
      
      if (!hasValidChannel) {
        formBuilder.showToast("至少需要添加一个订阅源", "error");
        return;
      }
    }
    
    // 获取表单数据
    const formData = formBuilder.getData();

    // 下载数据
    DataUtils.downloadJSON(formData, "form_data.json");
  });

  // 绑定复制JSON按钮事件
  const copyJsonBtn = document.getElementById("copyJsonBtn");
  copyJsonBtn.addEventListener("click", async () => {
    // 检查是否至少添加了一个订阅源
    const channelsContainer = document.getElementById("channels");
    if (channelsContainer) {
      const channelInputs = channelsContainer.querySelectorAll(".sortable-item-input");
      let hasValidChannel = false;
      
      for (let i = 0; i < channelInputs.length; i++) {
        if (channelInputs[i].value.trim()) {
          hasValidChannel = true;
          break;
        }
      }
      
      if (!hasValidChannel) {
        formBuilder.showToast("至少需要添加一个订阅源", "error");
        return;
      }
    }
    
    // 获取表单数据
    const formData = formBuilder.getData();

    // 复制数据到剪贴板
    const success = await DataUtils.copyJSONToClipboard(formData);

    // 显示友好的成功提示
    if (success) {
      formBuilder.showToast("JSON数据已复制到剪贴板", "success");
    } else {
      formBuilder.showToast("复制到剪贴板失败", "error");
    }
  });

  // 绑定从剪贴板初始化按钮事件
  const initFromClipboardBtn = document.getElementById("initFromClipboardBtn");
  initFromClipboardBtn.addEventListener("click", async () => {
    try {
      // 从剪贴板获取JSON数据
      const clipboardData = await DataUtils.getJSONFromClipboard();

      if (!clipboardData) {
        // 显示错误提示
        formBuilder.showToast("剪贴板中没有有效的JSON数据", "error");
        return;
      }

      // 使用数据初始化表单
      const success = formBuilder.initializeWithData(clipboardData);

      if (success) {
        // 显示成功提示
        formBuilder.showToast("表单已成功从剪贴板数据初始化", "success");
      } else {
        // 显示错误提示
        formBuilder.showToast("表单初始化失败，请检查数据格式", "error");
      }
    } catch (error) {
      console.error("从剪贴板初始化失败:", error);
      // 显示错误提示
      formBuilder.showToast("初始化失败: " + error.message, "error");
    }
  });
});
