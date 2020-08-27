import React, { Component, createRef } from "react";
import styles from "./index.module.css";
import propTypes from 'prop-types'
class Sticky extends Component {
  // 创建ref对象
  placeholder = createRef();
  content = createRef();
  handlerScroll = () => {
      const placeholderEl = this.placeholder.current;
      const contentEl = this.content.current;

        const {top} = placeholderEl.getBoundingClientRect()
      if(top<0){
        //  吸顶
        contentEl.classList.add(styles.fixed);
        placeholderEl.style.height = this.props.height+'px';
      }else {
        //   取消吸顶 
        contentEl.classList.remove(styles.fixed);
        placeholderEl.style.height = '0';
      }
  };
  // 监听scroll事件
  componentDidMount() {
    window.addEventListener("scroll", this.handlerScroll);
  }

  componentWillUnmount(){
      window.removeEventListener('scroll',this.handlerScroll)
  }
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    );
  }
}

Sticky.propTypes = {
    height:propTypes.number.isRequired
}
export default Sticky;
