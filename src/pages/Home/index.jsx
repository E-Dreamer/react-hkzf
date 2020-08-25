import React from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import List from '../List'
import Profile from '../Profile'
import Search from '../Search'
import New from '../New'
import { TabBar } from 'antd-mobile';
import './index.scss'

//tabbar数据
const tabItems = [
    {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
    },
    {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
    }, {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
    }
]
/* 
  轮播图存在的两个问题：
  1 不会自动播放
  2 从其他路由返回的时候，高度不够

  原因： 轮播图数据是动态加载的，加载完成前后轮播图数量不一致

  如何解决？？？
    1 在state中添加表示轮播图加载完成的数据
    2 在 轮播图数据加载完成时，修改该数据状态值为 true
    3 只有在轮播图数据加载完成的情况下，才渲染 轮播图组件
*/
export default class Home extends React.Component {
    state = {
        hidden: false,
        selectedTab: this.props.location.pathname
    }
    // 在这个生命周期中 判断路由地址是否切换 （对应tabbar的切换）
    componentDidUpdate(pervProps) {
        // console.log(pervProps);上一次的路由信息
        if (pervProps.location.pathname !== this.props.location.pathname) {
            //    此时说明路由发生切换了
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }
    renderTabBarItem() {
        return tabItems.map(item => <TabBar.Item
            title={item.title}
            key={item.path}
            icon={<i className={`iconfont ${item.icon}`}></i>
            }
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
                this.setState({
                    selectedTab: item.path
                })
                this.props.history.push(item.path)
            }}
        >
        </TabBar.Item>)
    }
    render() {
        return <div className='home'>
            {/* 渲染子路由  子路由的path 必须以父路由的path开头*/}
            {/* exact 精确匹配  */}
            <Route exact path='/home' component={Index}></Route>
            <Route path='/home/news' component={New}></Route>
            <Route path='/home/list' component={List}></Route>
            <Route path='/home/profile' component={Profile}></Route>
            <Route path='/home/search' component={Search}></Route>

            {/* TabBar */}
            <TabBar
                tintColor="#21b97a"
                barTintColor="white"
                hidden={this.state.hidden}
                noRenderContent={true}
            >
                {this.renderTabBarItem()}
            </TabBar>
        </div>
    }
}