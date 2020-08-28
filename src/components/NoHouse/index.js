import React from 'react'

import PropTypes from 'prop-types'

import { BASE_URL } from '../../utils/url'
import styles from './index.module.css'

const NoHouse = ({ children }) => (
  <div className={styles.root}>
    <img
      className={styles.img}
      src={BASE_URL + '/img/not-found.png'}
      alt="暂无数据"
    />
    <p className={styles.msg}>{children}</p>
  </div>
)

NoHouse.propTypes = {
  // node 表示可以渲染任何的内容
  children: PropTypes.node.isRequired
}

export default NoHouse
