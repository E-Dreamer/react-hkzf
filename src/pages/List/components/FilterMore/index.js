import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultSelected,
  };

  onTagClick(value) {
    const { selectedValues } = this.state;
    // 创建一个新数组
    const newSelectedValues = [...selectedValues];
    if (selectedValues.indexOf(value) <= -1) {
      // 不包含当前项的值
      newSelectedValues.push(value);
    } else {
      const index = newSelectedValues.findIndex((item) => item === value);
      newSelectedValues.splice(index, 1);
    }

    this.setState({
      selectedValues: newSelectedValues,
    });
  }

  // 取消按钮的时间处理程序
  onCancelFooter = () => {
    this.setState({
      selectedValues: [],
    });
  };

  //确定按钮的处理程序
  onOk = () => {
    const { type, onSave } = this.props;
    // onSave是filter 父组件中的方法
    onSave(type,this.state.selectedValues)

  };
  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state;

    // 高亮类名： styles.tagActive
    return data.map((item) => {
      const isSelected = selectedValues.indexOf(item.value) > -1;
      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
          onClick={this.onTagClick.bind(this, item.value)}
        >
          {item.label}
        </span>
      );
    });
  }

  render() {
    const {
      onCancel,
      data: { roomType, oriented, floor, characteristic },
      type
    } = this.props;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancelFooter}
          onOk={this.onOk}
        />
      </div>
    );
  }
}
