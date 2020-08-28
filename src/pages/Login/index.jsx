import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";

import { Link } from "react-router-dom";

// 导入withFormik
import { withFormik, Form, Field, ErrorMessage } from "formik";
import NavHeader from "../../components/NavHeader";
// 导入yup
import * as Yup from "yup";
import styles from "./index.module.css";
import { API } from "../../utils";

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

class Login extends Component {
  state = {
    username: "",
    password: "",
  };
  usernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };
  passwordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  handlerSubmit = async (e) => {
    // 阻止表单的默认行为
    e.preventDefault();
    // 获取账号和密码
    const { username, password } = this.state;
    const res = await API.post("/user/login", { username, password });
    const { status, body, description } = res.data;
    if (status === 200) {
      //  登入成功
      localStorage.setItem("hkzf_token", body.token);
      this.props.history.go(-1);
    } else {
      Toast.info(description, 2, null, false);
    }
  };
  render() {
    // const { username, password } = this.state;

    // 通过props 获取高阶组件传递过来的属性
    // touched 是否访问过  想要生效 必须添加 handleBlur
    // const {
    //   values,
    //   handleSubmit,
    //   handleChange,
    //   errors,
    //   touched,
    //   handleBlur,
    // } = this.props;
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              ></Field>
              {/* <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="请输入账号"
              /> */}
            </div>
            <ErrorMessage
              className={styles.error}
              name="username"
              component="div"
            ></ErrorMessage>
            {/* {errors.username && touched.username && (
              <div className={styles.error}>{errors.username}</div>
            )} */}
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              ></Field>
              {/* <input
                className={styles.input}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="请输入密码"
              /> */}
            </div>
            <ErrorMessage
              className={styles.error}
              name="password"
              component="div"
            ></ErrorMessage>
            {/* {errors.password && touched.password && (
              <div className={styles.error}>{errors.password}</div>
            )} */}
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

// 使用 withFormik 高阶组件 包装login组件  为login组件提供属性和方法
Login = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: "", password: "" }),
  // 添加表单验证
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required("账号为必填项")
      .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线 "),
    password: Yup.string()
      .required("密码为必填项")
      .matches(REG_PWD, "长度为5到12位，只能出现数字、字母、下划线 "),
  }),
  handleBlur: () => {},
  // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    const { username, password } = values;
    const res = await API.post("/user/login", { username, password });
    const { status, body, description } = res.data;

    if (status === 200) {
      //  登入成功
      localStorage.setItem("hkzf_token", body.token);
      //   无法在该方法中 通过this 来获取路由信息
      // 需要通过第二个参数对象 解构出props
      if (!props.location.state) {
        props.history.go(-1);
      }else {
        const {from} = props.location.state;
        // 如果使用push [home login map]
        // replace [home login]
        props.history.replace(from.pathname);
      }
     
    } else {
      Toast.info(description, 2, null, false);
    }
  },
})(Login);

export default Login;
