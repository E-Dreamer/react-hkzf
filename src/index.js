import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/fonts/iconfont.css'
import 'react-virtualized/styles.css'

// 应该将 组件的导入放在 样式导入后面 避免样式覆盖的问题
import App from './App';
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
