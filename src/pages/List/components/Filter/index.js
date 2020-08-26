import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API } from '../../../../utils/api'
import styles from './index.module.css'
import { object } from 'prop-types'

// 标题高亮状态
//true ：表示高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 和FilterMore 的展示和隐藏
    openType: '',
    filterData: [],
    // 筛选条件的选择状态
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }
  componentDidMount() {
    this.getFilterData();
  }
  // 封装获取所有筛选条件的方法
  async getFilterData() {
    //  获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses/condition?id=' + value);
    console.log(res);
    this.setState({
      filterData: res.data.body
    })
  }
  // 注意this指向的问题 不用箭头函数 就是undefined
  changeSelect = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state;
    //创建新的标题选择状态
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    Object.keys(titleSelectedStatus).forEach(key => {
      // item 是对象中的键
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return;
      }
      const selectedVal = selectedValues[key];
      // 其他标题
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true;
      }else if(key === 'more'){
        // 更多选择项 filterMore
      }else {
        newTitleSelectedStatus[key] = false;
      }
    })
    this.setState({
      openType: type,
      // 更新使用 新的标题选择状态对象 来更新
      titleSelectedStatus:newTitleSelectedStatus
    })
    // this.setState(prevState => {
    //   return {
    //     titleSelectedStatus: {
    //       // 获取对象中 所有属性的值
    //       ...prevState.titleSelectedStatus,
    //       [type]: true
    //     },
    //     openType: type
    //   }
    // })
  }

  // 隐藏对话框
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 确定
  onSave = (type, value) => {
    // console.log(type, value);
    this.setState({
      openType: '',
      selectedValues: {
        ...this.state.selectedValues,
        // 更新当前type 对应的选中值
        [type]: value
      }
    })
  }

  renderFilterPicker() {
    const { openType, filterData: { area, subway, rentType, price }, selectedValues } = this.state;
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null;
    }
    // 根据opentype 来筛选数据
    let data = [];
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway];
        cols = 3;
        break;
      case 'mode':
        data = rentType;
        cols = 1;
        break;
      case 'price':
        data = price;
        cols = 1;
        break;
      default: break;
    }
    return <FilterPicker
      key={openType}
      onCancel={this.onCancel}
      onSave={this.onSave}
      data={data}
      cols={cols}
      type={openType}
      defaultValue={defaultValue}
    />
  }

  renderFilterMore() {
    const { openType,filterData:{roomType,oriented,floor,characteristic} } = this.state;
    if(openType !== 'more'){
      return null
    }
    const data = {roomType,oriented,floor,characteristic}
    return <FilterMore 
    onCancel={this.onCancel} 
    data={data}
    />
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price') ?
            <div className={styles.mask} onClick={this.onCancel} /> : ''
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            changeSelect={this.changeSelect}
          />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }


          {/* 最后一个菜单对应的内容： */}
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}
