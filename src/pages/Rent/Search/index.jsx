import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import styles from "./index.module.css";
import { API, getCity } from "../../../utils";

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value;

  state = {
    // 搜索框的值
    searchTxt: "",
    tipsList: [],
  };
  // 列表点击
  itemClick=(item)=>{
    this.props.history.replace('/rent/add',{
      name:item.communityName,
      id:item.community
    })
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state;

    return tipsList.map((item) => (
      <li key={item.community} className={styles.tip} onClick={this.itemClick.bind(this,item)}>
        {item.communityName}
      </li>
    ));
  };

  // 用户输入
  onChange = (value) => {
    this.setState({
      searchTxt: value,
    });

    if (!value) {
      // 为空
      return this.setState({
        tipsList: [],
      });
    }
    // 不为空  请求 获取数据
    clearTimeout(this.time);
    this.time = setTimeout(async () => {
      const res = await API.get("/area/community", {
        params: { name: value, id: this.cityId },
      });
      const {body} = res.data;
      this.setState({
        tipsList:body
      })
    }, 500);
  };
  render() {
    const { history } = this.props;
    const { searchTxt } = this.state;

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace("/rent/add")}
          onChange={this.onChange}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    );
  }
}
