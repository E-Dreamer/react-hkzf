import React from "react";
import SearchHeader from "../../components/SearchHeader";
import { Flex, Toast } from "antd-mobile";
import {
  List,
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
} from "react-virtualized";
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import Fliter from "./components/Filter";
import styles from "./index.module.css";
import HouseItem from "../../components/HouseItem";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import { getCurrentCity } from "../../utils";
/*
组件外部的代码 只会在项目加载时执行一次 在切换路由时 不会重新执行
*/
// 获取当前的信息
// const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表数据
      list: [],
      // 总条数
      count: 0,
      // 数据正在加载中
      isLoading: false,
    };
  }
  // 初始化默认值
  label = ''
  value = ''
  // 初始化 实例属性
  filters = {};
  async componentDidMount() {
    const { label,value } = await getCurrentCity();
    this.label = label;
    this.value = value;
    this.searchHouseList();
  }
  // 获取房屋列表数据
  async searchHouseList() {
    Toast.loading("加载中...", 0, null, false);
    this.setState({
      isLoading: true,
    });
    //    获取当前定位城市的id
    const { value: cityId } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await API.get("/houses", {
      params: { cityId, ...this.filters, start: 1, end: 20 },
    });

    const { list, count } = res.data.body;
    Toast.hide();
    // 提示房源数据
    if (count) {
      Toast.info(`共找到${count}套房源`, 2, null, false);
    }

    this.setState({
      list,
      count,
      isLoading: false,
    });
  }

  //渲染列表数据
  renderList() {
    const { count, isLoading } = this.state;
    if (!count && !isLoading) {
      return <NoHouse>没有找到房源,请换个条件搜索吧~</NoHouse>;
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight //设置高度 为 windowScroller 最终渲染的最终高度
                    width={width} //这是视口的宽度
                    height={height} //这是视口的高度
                    rowCount={count} //List列表项的条数
                    onRowsRendered={onRowsRendered}
                    registerChild={registerChild}
                    rowHeight={120} //每一行的高度
                    rowRenderer={this.rowRenderer} //渲染列表项的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  }

  // 接受filter组件中 筛选条件数据
  onFilter = (filters) => {
    window.scrollTo(0, 0);
    this.filters = filters;
    // console.log('接口条件',this.filters);
    this.searchHouseList();
  };

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    style, //重点属性 一定给每一行数据 添加样式 Stye object to be applied to row (to position it)
  }) => {
    // 根据索引号 获取当前这一行的房屋数据
    const { list } = this.state;
    const house = list[index];
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      );
    }
    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        desc={house.desc}
        title={house.title}
        tags={house.tags}
        price={house.price}
        onClick={()=>this.props.history.push('/detail/'+house.houseCode)}
      />
    );
  };
  // 判断列表中的每一行是否加载成功
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };
  // 用来获取更多房屋列表数据的
  /* 注意 该方法的返回值是一个promise对象 并且 这个对象应该在数据加载完成是，来调用resolve让
  promise对象的状态变成已完成
  */
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // return fetch(
    //   `path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`
    // ).then((response) => {
    // });
    console.log(startIndex, stopIndex);
    return new Promise(async (resolve) => {
      // 数据加载完成时 调用resolve方法
      const { value: cityId } = JSON.parse(localStorage.getItem("hkzf_city"));
      const res = await API.get("/houses", {
        params: { cityId, ...this.filters, start: startIndex, end: stopIndex },
      });
      this.setState({
        list: [...this.state.list, ...res.data.body.list],
      });
      // 数据加载完成，调用resolve
      resolve();
    });
  };

  /*
    给searchHeader组件 传递className 类名 来修改
    */
  render() {
    return (
      <div className="list">
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => {
              this.props.history.go(-1);
            }}
          ></i>
          <SearchHeader
            cityname={this.label}
            className={styles.searchHeader}
          ></SearchHeader>
        </Flex>

        {/* 条件筛选栏 */}
        <Sticky height={40}>
          <Fliter onFilter={this.onFilter}></Fliter>
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    );
  }
}
