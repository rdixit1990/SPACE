import React, { Component } from 'react';
import "../src/App.css";
import { Layout, Menu, Button, Row, Col, Badge , BackTop} from 'antd';
import { UserOutlined, AreaChartOutlined, InfoCircleOutlined, LaptopOutlined, NotificationOutlined, FundOutlined, CodepenOutlined, DoubleLeftOutlined, BellOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Dashboard from "./Dashboard";
import Repository from './Repository';
import jobManagement from "./jobManagement";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
    };

  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  render() {
    const { SubMenu } = Menu;
    const { Header, Content, Sider , Footer} = Layout;

    return (<div>
      
      <Router>
        <Layout style={{ height: "80vh" }}>
          <Sider className="site-layout-background" width={200} trigger={null} collapsible collapsed={this.state.collapsed}>
            <img style={{ width: '110px' }} className="saama-logo" src="https://www.saama.com/wp-content/themes/saama/assets/img/saama-logo-white-tag.svg" />

            {/*<Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    <MenuFoldOutlined />
                  </Button>*/}
            <span onClick={this.toggleCollapsed} className={this.state.collapsed == true ? 'back-btn-collapsed' : 'back-btn-normal'}>
              {this.state.collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            </span>

            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              theme="dark"
            >
              <SubMenu key="sub0" title={
                <span>
                  <Link to="/dashboard" >
                    <AreaChartOutlined />
                    <span>Dashboard</span>
                  </Link>

                </span>
              }>
              </SubMenu>
              <SubMenu key="sub1" title={
                <span>
                  <Link to="/repository">
                    <CodepenOutlined />
                    <span>Repository</span>
                  </Link>
                </span>
              }>
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="Administration">
                <Menu.Item key="5">Folder Template</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={
                <span>
                  <Link to="/jobManagement" >
                    <NotificationOutlined />
                    <span>Job Management</span>
                  </Link>

                </span>
              }>
               </SubMenu>
              <SubMenu key="sub4" icon={<FundOutlined />} title="AutoML">
              </SubMenu>
              <SubMenu key="sub5" icon={<InfoCircleOutlined />} title="Help"></SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header className="header">
              <div className="logo" >
                <UserOutlined />
                <div className="notify-div"><Badge count={99}>
                  <BellOutlined />
                </Badge>
                </div>


              </div>
            </Header>

            <Content style={{ margin: '24px 10px', padding: 21, background: '#fff' }}>
              <Switch>
                <Route exact path={"/"} component={Repository} />
                <Route exact path={"/repository"} component={Repository} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/jobManagement" component={jobManagement}/>
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>Saama Design ©2018 Created by PACE</Footer>
      </Router>
    </div>);
  }
}


export default App;
