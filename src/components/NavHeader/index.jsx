import React from "react";
import { NavBar } from "antd-mobile";
// 导入 withRouter 组件
import { withRouter } from "react-router-dom";
//导入props 检验
import propTypes from "prop-types";
// import './index.scss'
import style from "./index.module.css";
/*
注意 默认情况下 只有路由 Route直接渲染的组件才能获取到路由信息
如果需要在其他组件中 获取到路由信息 可以通过withRouter 高阶组件来获取
*/

/*
添加props 检验 
首先安装 prop-types
*/
function NavHeader({
  children,
  history,
  onLeftClick,
  className,
  rightContent,
}) {
  // 默认点击行为
  const defaultHandler = () => history.go(-1);

  return (
    <NavBar
      className={[style.navbar, className || ""].join(" ")}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={onLeftClick || defaultHandler}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  );
}
// 添加props检验
NavHeader.propTypes = {
  children: propTypes.string.isRequired,
  onLeftClick: propTypes.func,
};
//  withRouter的返回值 也是一个组件
export default withRouter(NavHeader);
