import React from "react";
import { Toast } from "antd-mobile";
import "./index.scss";
import { getCurrentCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import { API } from "../../utils/api";
import NavHeader from "../../components/NavHeader";
// 渲染城市的数据格式
// {a:[],b:[]}
// 渲染右侧索引的数据格式：
// ['a','b']

// 索引 （A，B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];
// 数据格式化的方法  传递数组list
const formatCityData = (list) => {
  const cityList = {};

  // 遍历list数组
  list.forEach((item) => {
    // 获取每一个城市的首字母
    const first = item.short.substr(0, 1);
    // 判断citylist中是否存在该分类
    if (cityList[first]) {
      // 如果有 直接往该分类push数据
      cityList[first].push(item);
    } else {
      // 如果没有 就先创建数组 然后吧当前信息添加到数组中
      cityList[first] = [item];
    }
  });

  // 获取索引数组
  const cityIndex = Object.keys(cityList).sort();

  return {
    cityList,
    cityIndex,
  };
};

// 封装处理字母索引的方法
const formatCityName = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};
// const list = Array(100).fill('react-virtualized')

export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    };
    // 创建ref对象
    this.cityListComponent = React.createRef();
  }

  async componentDidMount() {
    await this.getCityList();
    // 调用 measureAllRows 提前计算 List中的每一行的高度 实现scrollToRow 的精确跳转
    this.cityListComponent.current.measureAllRows();
  }
  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      //有房源数据 保存本地数据中 并且返回该城市
      localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
      this.props.history.go(-1);
    } else {
      //提示用户没有房源信息
      Toast.info("该城市暂无房源数据", 1, null, false);
    }
  }
  // 渲染每一行数据的元素
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在List中 是可见的
    style, //重点属性 一定给每一行数据 添加样式 Style object to be applied to row (to position it)
  }) => {
    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    // 获取指定字母索引下的数组
    //  cityList[letter];
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityName(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              this.changeCity(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  // 创建动态计算每一行的高度的方法
  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state;
    // 高度 = 索引标题高度 + 城市的数量 * 城市的高度
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };
  // 渲染城市索引列表
  renderCityIndex() {
    // 获取到 cityIndex，并遍历其，实现渲染
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }
  // 滚动时 对应右侧 索引 高亮显示
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };

  // 获取城市列表数据的方法
  async getCityList() {
    // 开启loading
    Toast.loading("loading....", 0, null, false);
    try {
      const res = await API.get("/area/city?level=1");
      const { cityList, cityIndex } = formatCityData(res.data.body);
      /*
            1 获取热门城市数据
            2 将数据添加到cityList中
            3 将索引添加到cityIndex中
            */
      const hotRes = await API.get("/area/hot");
      cityList["hot"] = hotRes.data.body;
      cityIndex.unshift("hot");

      //获取定位城市的方法
      const curcity = await getCurrentCity();
      cityList["#"] = [curcity];
      cityIndex.unshift("#");
      this.setState({
        cityIndex,
        cityList,
      });
      Toast.hide();
    } catch (e) {
      Toast.hide();
    }
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
    Toast.hide();
  };
  render() {
    return (
      <div className="citylist">
        {/* <NavBar
                className='navbar'
                mode="light"
                icon={<i className='iconfont icon-back'></i>}
                onLeftClick={() => this.props.history.go(-1)}
            >城市选择</NavBar> */}
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
              width={width}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        {/* 
          1 封装 renderCityIndex 方法，用来渲染城市索引列表。
          2 在方法中，获取到索引数组 cityIndex ，遍历 cityIndex ，渲染索引列表。
          3 将索引 hot 替换为 热。
          4 在 state 中添加状态 activeIndex ，指定当前高亮的索引。
          5 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件。
        */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
