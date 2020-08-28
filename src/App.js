import React from 'react';
//导入路由
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import detail from './pages/HouseDetail'
import Login from './pages/Login'
// 导入房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'
// 导入路由
import AuthRoute from './components/AuthRoute'
function App() {
  return (
    <Router>
      <div className="App">
       {/* 默认路由匹配时 路由跳转到home 路由重定向 */}
        <Route exact path='/' render={()=><Redirect to='/home'></Redirect>} ></Route>
        {/* 配置路由 */}
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
        <Route path='/detail/:id' component={detail}></Route>
        <Route path='/login' component={Login}></Route>
        <AuthRoute exact path='/rent' component={Rent }></AuthRoute>
        <AuthRoute path='/rent/add' component={RentAdd }></AuthRoute>
        <AuthRoute path='/rent/search' component={RentSearch }></AuthRoute>
      </div>
    </Router>
  );
}

export default App;
