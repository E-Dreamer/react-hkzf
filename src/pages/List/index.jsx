import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import { Flex } from 'antd-mobile'
import Fliter from './components/Filter'
import style from './index.module.css'
// 获取当前的信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))
export default class New extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    /*
    给searchHeader组件 传递className 类名 来修改
    */
    render() {
        return (
            <div className='list'>
                <Flex className={style.header}>
                    <i className='iconfont icon-back' onClick={()=>{this.props.history.go(-1)}}></i>
                    <SearchHeader cityname={label} className={style.searchHeader}></SearchHeader>
                </Flex>
                <Fliter></Fliter>
            </div>
        )
    }
}