import React from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import { getCurrentCity } from "../../utils";
import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import SearchHeader from "../../components/SearchHeader";
import "./index.scss";
// 导入导航菜单图片
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent/add",
  },
];

export default class New extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    isSwipersLoad: false,
    groups: [],
    // 最新资讯
    news: [],
    cityname: "长沙",
  };
  // 获取轮播图的数据
  async getSwipers() {
    const res = await API.get("/home/swiper");
    // 简单的方式
    this.setState({
      swipers: res.data.body,
      isSwipersLoad: true,
    });

    // this.setState(() => {
    //     return {
    //         swiper: res.data.body
    //     }
    // })
  }
  // 获取租房小组的数据
  async getGroups() {
    const res = await API.get("/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      groups: res.data.body,
    });
  }
  async getNews() {
    const res = await API.get("/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      news: res.data.body,
    });
  }
  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
    getCurrentCity().then((res) => {
      this.setState({
        cityname: res.label,
      });
    });
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="#"
        style={{ display: "inline-block", width: "100%", height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", height: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }
  // 渲染导航菜单
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }

  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={BASE_URL + item.imgSrc} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  render() {
    return (
      <div className="index">
        <div className="swiper">
          {this.state.isSwipersLoad ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}

          {/* 搜索框 */}
          <SearchHeader cityname={this.state.cityname}></SearchHeader>
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          ></Grid>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
