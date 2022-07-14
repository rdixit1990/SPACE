import React from 'react';
import { Layout, Menu, Tree, Row, Col, Tag,Popover } from 'antd';
import "../src/App.css";
import { SlackOutlined, AreaChartOutlined, CodeOutlined, SettingOutlined, BoxPlotOutlined, RobotOutlined, GlobalOutlined, HddOutlined, NotificationOutlined } from '@ant-design/icons';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import Dashboard from "./Applications/Dashboard";
import Repository from './Applications/Repository';
import jobExecutionSummary from "./Applications/jobExecutionSummary";
import jobConfiguraion from "./Applications/JobConfiguration";
import Administration from "./Applications/Administration";
import AddNewJob from "./Applications/AddNewJob";
import FolderTemplate from "./Applications/FolderTemplate";
import AIML from "./Applications/AIML";
import Axios from 'axios';
import Api from "./constants/api";
import constants from "./constants/constants"
import LsacSupernavbar from '@saama/lsac-supernavbar';

/* Starts here */
Axios.interceptors.request.use(function (config) {
  document.body.classList.add('loading-indicator');
  const token = window.localStorage.token;
  if (token) {
    config.headers.Authorization = `token ${token}`
  }
  return config
}, function (error) {
  document.body.classList.remove('loading-indicator');
  return Promise.reject(error);
});

Axios.interceptors.response.use(function (response) {
  document.body.classList.remove('loading-indicator');
  return response;
}, function (error) {
  document.body.classList.remove('loading-indicator');
  return Promise.reject(error);
});

/* End */

const { DirectoryTree } = Tree;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      notifcationAlerts: [],
      notificationCount: "",
      selectedKeys: "1",
      isRepoSitoryClick: false,
      pageHeading: 'Repository',
    };

  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount() {
    if (window.location.hash == "#/dashboard") {
      this.setState({
        selectedKeys: "1"
      });

    } else if (window.location.hash == "#/admin" || window.location.hash.includes("admin")) {
      this.setState({
        selectedKeys: "3"
      });

    } else if (window.location.hash == "#/repository") {
      this.setState({
        selectedKeys: "2"
      });
    } else if (window.location.hash == "#/jobConfiguraion" || window.location.hash == "#/jobConfiguraion/addNewJob") {
      this.setState({
        selectedKeys: "4"
      });
    } else if (window.location.hash == "#/jobExecutionSummary") {
      this.setState({
        selectedKeys: "5"
      });
    }
    this.getAutoMLData();
  }

  handleClick = e => {
    this.setState({ selectedKeys: e.key });
  };


  getAutoMLData = () => {
    let res = Api.userJobs();
    res.then((opt) => {
      this.setState({
        notifcationAlerts: opt.data.jobs.sort((a, b) => new Date(b.upload_time) - new Date(a.upload_time)),
        notificationCount: opt.data.jobs.length
      });
    });
  }

  notificationMenu = () => {
    return (<div style={{height:300,overflowY:'scroll',overflowX:'hidden'}}>
    {this.state.notifcationAlerts.map((element) => {
      return(
        <Row gutter={24} className="margin-top-10" style={{borderBottom:'1px solid gray',padding:5}}>
          <Col span={24}>
          {element.exp_name}-<strong>{element.job_type}</strong> has successfully trained
          </Col>
        </Row>
      )
    })}
    </div>);
  };

  render() {
    const { Header, Sider, Content, Footer } = Layout;
    const { SubMenu } = Menu;

    return (<div>

      <Router>
        <Layout>
          <Row>
            <lsac-supernavbar
              applicationTitle="SPACE"
              displayMode='minimal_sidebar'
              runMode='ui_dev_mode'
              logoutUrl={'/logout'} />
          </Row>
          <Layout className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                margin: '15px 10px',
                padding: 24,
                height: 'auto',
                minHeight: 550,
              }}
            >
              <Row gutter={24}>
                <Col span={23}>
                  <h2>Hi (<span style={{ marginLeft: 5 }}>{constants.USER_ID == "Ranjeet" ? <Tag color="#00b4d8">{"Programmer".toUpperCase()}</Tag> : <Tag color="#52b69a">{"Validator".toUpperCase()}</Tag>}</span>)</h2>
                </Col>
                <Col span={1}>
                  <span style={{ marginTop: 5, fontSize: 26, color: "#4895ef", float: "right", cursor: 'pointer' }}>
                    <Popover placement="topLeft" content={this.notificationMenu} title="Notifications / Alerts">
                      <GlobalOutlined />
                    </Popover>
                  </span>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: 20 }} className="margin-top-5">
                <Col span={24}>
                  <Menu mode="horizontal" onClick={this.handleClick} defaultSelectedKeys={[this.state.selectedKeys]}
                    selectedKeys={this.state.selectedKeys}>
                    <Menu.Item key="1" id="dashboard" icon={<AreaChartOutlined className="headrIcn" />}><a href="#/dashboard">Dashboard</a></Menu.Item>
                    <Menu.Item key="2" icon={<SlackOutlined className="headrIcn" />}><a href="#/repository">Repository</a></Menu.Item>
                    <Menu.Item key="3" icon={<SettingOutlined className="headrIcn" />}><a href="#/admin">Administration</a></Menu.Item>
                    <Menu.Item key="4" icon={<BoxPlotOutlined className="headrIcn" />}><a href="#/jobConfiguraion">Job Configuration</a></Menu.Item>
                    <Menu.Item key="5" icon={<CodeOutlined className="headrIcn" />}><a href="#/jobExecutionSummary">Job Execution Summary</a></Menu.Item>
                    <Menu.Item key="6" icon={<RobotOutlined className="headrIcn" />}><a href="#/aiml">AutoML</a></Menu.Item>
                  </Menu>
                </Col>
              </Row>
              <Switch>
                <Route exact path={"/"} component={Dashboard} />
                <Route exact path={"/repositor*"} component={Repository} />
                <Route exact path={"/dashboard"} component={Dashboard} />
                <Route exact path={"/jobExecutionSummary"} component={jobExecutionSummary} />
                <Route exact path={"/jobConfiguraion"} component={jobConfiguraion} />
                <Route exact path={"/admin"} component={Administration} />
                <Route exact path={"/admin/:id"} component={FolderTemplate} />
                <Route exact path={"/jobConfiguraion/addNewJob"} component={AddNewJob} />
                <Route exact path={"/aiml"} component={AIML} />
                {/*}  <Route exact path={"/repository"} component={Repository} />*/}
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center', marginTop: -30 }}>Copyright ©2021 Saama Technologies</Footer>
          </Layout>
        </Layout>

      </Router>
    </div>);
  }
}


export default App;
