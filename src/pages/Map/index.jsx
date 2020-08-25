import React from 'react'
import { NavBar } from 'antd-mobile';
import './index.scss'
export default class Map extends React.Component{
    state={}
    componentDidMount(){
        // 在react 脚手架中 全局对象 需要使用window来访问 否则会造成eslint报错
        const map = new window.BMapGL.Map("container");
        // 设置中心点坐标
        const point = new window.BMapGL.Point(116.404, 39.915);
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 15); 
    }
    render(){
        return <div className='map'>
            <NavBar
                className='navbarmap'
                mode="light"
                icon={<i className='iconfont icon-back'></i>}
                onLeftClick={() => this.props.history.go(-1)}
            >当前地图</NavBar>
           <div id="container"></div> 
        </div>
    }
}