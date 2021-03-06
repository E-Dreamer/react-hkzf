import React from 'react'

import { Flex } from 'antd-mobile'
import './index.scss'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
function SearchHeader({ cityname, history,className }) {
    return (
        <Flex className={["search-box",className || ''].join(' ')}>
            {/* 左侧白色区域 */}
            <Flex className="search">
                {/* 位置 */}
                <div
                    className="location"
                    onClick={() => history.push('/citylist')}
                >
                    <span className="name">{cityname}</span>
                    <i className="iconfont icon-arrow" />
                </div>

                {/* 搜索表单 */}
                <div
                    className="form"
                    onClick={() => history.push('/rent/search')}
                >
                    <i className="iconfont icon-seach" />
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
                className="iconfont icon-map"
                onClick={() => history.push('/map')}
            />
        </Flex>
    )
}

SearchHeader.propTypes = {
    cityname:propTypes.string.isRequired
}
export default withRouter(SearchHeader)