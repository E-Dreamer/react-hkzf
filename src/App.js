import React,{lazy,Suspense} from 'react';
//导入路由
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// //导入首页和城市选择两个组件
import Home from './pages/Home'
// import CityList from './pages/CityList'
// import Map from './pages/Map'
// import detail from './pages/HouseDetail'
// import Login from './pages/Login'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'
import AuthRoute from './components/AuthRoute'

// 路由分割  启动路由懒加载 动态组件的方式导入组件
const CityList = lazy(()=>import('./pages/CityList'))
const Map = lazy(()=>import('./pages/Map'))
const detail = lazy(()=>import('./pages/HouseDetail'))
const Login = lazy(()=>import('./pages/Login'))
const Rent = lazy(()=>import('./pages/Rent'))
const RentAdd = lazy(()=>import('./pages/Rent/Add'))
const RentSearch = lazy(()=>import('./pages/Rent/Search'))


function App() {
  return (
    <Router>
      <Suspense fallback={null}>
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
      </Suspense>
    </Router>
  );
}

export default App;
