import React from 'react';
//导入路由
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
      <div className="App">
       {/* 默认路由匹配时 路由跳转到home 路由重定向 */}
        <Route exact path='/' render={()=><Redirect to='/home'></Redirect>} ></Route>
        {/* 配置路由 */}
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
      </div>
    </Router>
  );
}

export default App;
