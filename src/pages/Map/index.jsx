import React from 'react'
import {API} from '../../utils/api'
import  {BASE_URL} from '../../utils/url'
// 导入封装好的navheader组件
import NavHeader from '../../components/NavHeader'
import style from './index.module.css'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import HouseItem from '../../components/HouseItem/index'
const BMapGL = window.BMapGL


// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {
    state = {
        // 小区下的房源列表
        housesList: [],
        // 是否展示房源列表
        isShowList: false
    }
    componentDidMount() {
        this.initMap();
    }
    componentWillUnmount(){
        Toast.hide();
    }
    // 封装 渲染覆盖物入口
    // 接受区域id参数 根据id请求房源数据
    async renderOverlays(id) {
        try {
            // 开启loading
            Toast.loading('loading....', 0, null, false);
            const result = await API.get( `/area/map?id=${id}`);
            const data = result.data.body;
            Toast.hide();
            // 调用 方法 获取级别和类型
            const { nextZoom, type } = this.getTypeAndZoom()
            data.forEach(item => {
                this.createOverlays(item, nextZoom, type)
            })
        } catch (e) {
            Toast.hide();
        }

    }
    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区 => 11 ,范围  >=10 <12
    //镇 =>13,  范围 >=12 <14
    //小区 ->15 范围 >=14 <16
    getTypeAndZoom() {
        const zoom = this.map.getZoom();
        let nextZoom, type
        if (zoom >= 10 && zoom < 12) {
            type = 'circle';
            nextZoom = 13;
        } else if (zoom >= 12 && zoom < 14) {
            type = 'circle';
            nextZoom = 15;
        } else if (zoom >= 14 && zoom < 16) {
            type = 'rect';
        }
        return { type, nextZoom }
    }
    // 创建覆盖物
    createOverlays(data, zoom, type) {
        const { coord: { longitude, latitude }, label: areaName, count, value } = data
        //为每一条数据 创建覆盖物
        const areaPoint = new BMapGL.Point(longitude, latitude)
        if (type === 'circle') {
            // 区 和 镇
            this.createCircle(areaPoint, areaName, count, value, zoom);
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建圆形的 覆盖物
    createCircle(areaPoint, areaName, count, value, zoom) {

        const label = new BMapGL.Label('', {
            position: areaPoint,
            offset: new BMapGL.Size(-35, -35)
        })
        // // 给label对象 一个唯一表示
        label.id = value;
        //    设置房源覆盖物
        label.setContent(`
                <div class="${style.bubble}">
                   <p class='${style.name}'>${areaName}</p>
                   <p>${count}套</p>
                </div>   
            `)
        /*
        创建label实例对象
        调用setStyle（） 方法设置样式
        */
        label.setStyle(labelStyle)
        // 添加单击事件
        label.addEventListener('click', () => {
            // console.log('房源呗点击了',label.id);
            this.map.centerAndZoom(areaPoint, zoom);
            // 清除当前覆盖物信息
            setTimeout(() => {
                this.map.clearOverlays();
            }, 0);

            this.renderOverlays(label.id)
        })
        // 添加覆盖物到地图中
        this.map.addOverlay(label);
    }
    // 创建矩形 覆盖物
    // 创建小区覆盖物
    createRect(point, name, count, id) {
        // 创建覆盖物
        const label = new BMapGL.Label('', {
            position: point,
            offset: new BMapGL.Size(-50, -28)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="${style.rect}">
        <span class="${style.housename}">${name}</span>
        <span class="${style.housenum}">${count}套</span>
        <i class="${style.arrow}"></i>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', e => {
            /* 
              1 创建 Label 、设置样式、设置 HTML 内容，绑定单击事件。
              
              2 在单击事件中，获取该小区的房源数据。
              3 展示房源列表。
              4 渲染获取到的房源数据。
      
              5 调用地图 panBy() 方法，移动地图到中间位置。
                公式：
                  垂直位移：(window.innerHeight - 330) / 2 - target.clientY
                  水平平移：window.innerWidth / 2 - target.clientX
              6 监听地图 movestart 事件，在地图移动时隐藏房源列表。
            */

            this.getHousesList(id)

            // 获取当前被点击项
            const target = e.domEvent.changedTouches[0]
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            )
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }
    // 获取小区房源数据
    async getHousesList(id) {
        try {
            // 开启loading
            Toast.loading('loading....', 0, null, false);
            const res = await API.get(`/houses?cityId=${id}`)
            Toast.hide();
            this.setState({
                housesList: res.data.body.list,
                isShowList: true
            })
        } catch (e) {
            Toast.hide();
        }
    }
    // 封装渲染房屋列表的方法
    // <HouseItem 
    //           src={BASE_URL + item.houseImg}
    //           title={item.title}
    //           desc={item.desc}
    //           tags={item.tags}
    //           price={item.price}
    //         />
    renderHousesList() {
        return  this.state.housesList.map(item => (
            <div className={style.house} key={item.houseCode}>
                <div className={style.imgWrap}>
                    <img
                        className={style.img}
                        src={BASE_URL + item.houseImg}
                        alt=""
                    />
                </div>
                <div className={style.content}>
                    <h3 className={style.title}>{item.title}</h3>
                    <div className={style.desc}>{item.desc}</div>
                    <div>
                        {/* ['近地铁', '随时看房'] */}
                        {item.tags.map((tag, index) => {
                            const tagClass = 'tag' + (index + 1)
                            return (
                                <span
                                    className={[style.tag, style[tagClass]].join(' ')}
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            )
                        })}
                    </div>
                    <div className={style.price}>
                        <span className={style.priceNum}>{item.price}</span> 元/月
                </div>
                </div>
            </div>
        ))
    }
    //初始化地图
    initMap() {
        //获取当前定位城市 
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 在react 脚手架中 全局对象 需要使用window来访问 否则会造成eslint报错
        const map = new BMapGL.Map("container");
        // 作用 可以在其他方法中 使用map
        this.map = map;
        // 设置中心点坐标
        // const point = new window.BMapGL.Point(116.404, 39.915);

        const myGeo = new BMapGL.Geocoder();
        myGeo.getPoint(label, async point => {
            if (point) {
                // 地图初始化，同时设置地图展示级别
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMapGL.Marker(point));      
                // 添加控件
                var opts = { offset: new BMapGL.Size(150, 5) }
                map.addControl(new BMapGL.ScaleControl(opts))
                map.addControl(new BMapGL.ZoomControl())

                //调用 renderOverlays方法
                this.renderOverlays(value)
                // const result = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                // result.data.body.forEach(item => {
                //     const { coord: { longitude, latitude }, label: areaName, count, value } = item
                //     //为每一条数据 创建覆盖物
                //     const areaPoint = new BMapGL.Point(longitude, latitude)

                //     const label = new BMapGL.Label('', {
                //         position: areaPoint,
                //         offset: new BMapGL.Size(-35, -35)
                //     })
                //     // 给label对象 一个唯一表示
                //     label.id = value;
                //     //    设置房源覆盖物
                //     label.setContent(`
                //         <div class="${style.bubble}">
                //            <p class='${style.name}'>${areaName}</p>
                //            <p>${count}套</p>
                //         </div>   
                //     `)
                //     /*
                //     创建label实例对象
                //     调用setStyle（） 方法设置样式
                //     */
                //     label.setStyle(labelStyle)
                //     // 添加单击事件
                //     label.addEventListener('click', () => {
                //         // console.log('房源呗点击了',label.id);
                //         map.centerAndZoom(areaPoint, 13);
                //         // 清除当前覆盖物信息
                //         setTimeout(() => {
                //             map.clearOverlays();
                //         }, 0);

                //     })
                //     // 添加覆盖物到地图中
                //     map.addOverlay(label);
                // })

            }
        },
            label);

        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }
    render() {
        return <div className={style.map}>
            {/* 可以自定义点击左侧按钮的 函数 如果没有定义 就是默认行为 返回上一页 onLeftClick={() => console.log('点击了左侧按钮')} */}
            <NavHeader >
                地图找房
           </NavHeader>
            <div id="container" className={style.container}></div>

            {/* 房源列表 */}
            {/* 添加 style.show 展示房屋列表 */}
            <div
                className={[
                    style.houseList,
                    this.state.isShowList ? style.show : ''
                ].join(' ')}
            >
                <div className={style.titleWrap}>
                    <h1 className={style.listTitle}>房屋列表</h1>
                    <Link className={style.titleMore} to="/home/list">
                        更多房源
            </Link>
                </div>

                <div className={style.houseItems}>
                    {/* 房屋结构 */}
                    {this.renderHousesList()}
                </div>
            </div>
        </div>
    }
}