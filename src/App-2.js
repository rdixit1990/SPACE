import React from 'react';
import "../src/App.css";
import { Layout, Form, Input, Button, Checkbox, Statistic, Progress, Card } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  const { Header, Footer, Content } = Layout;
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 8,
    },
  };

  return (
    <div className="App">
      <div className="main-div">
        <Layout>
          <Header className="header-txt">
            <span className="main-text">FISYB
        </span>
            <span className="main-text-desc">Funding / Investment solution for your business </span>
          </Header>
          <Content>
            <div className="formDiv">
              <Form
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Business Name"
                  name="businessName"
                >
                  <Input placeholder="Enter your business name" />
                </Form.Item>


                <Form.Item
                  label="Looking for"
                  name="amount"
                >
                  <Input placeholder="How much of money you are asking for" />
                </Form.Item>

                <Form.Item
                  label="Equity"
                  name="equity"
                >
                  <Input placeholder="% Of Equity" />
                </Form.Item>

                <Form.Item
                  label="C.A Cost"
                  name="CustomerAcqCost"
                >
                  <Input placeholder="Enter your customer acquisition cost" />
                </Form.Item>

                <Form.Item
                  label="Money Raised"
                  name="CustomerAcqCost"
                >
                  <Input placeholder="How much of money raised for ?" />
                </Form.Item>


                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Do you have any debt ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>You owns 100% of your Business ?</Checkbox>
                </Form.Item>


                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Do you have any Patent ( Utility / Provisional / Design ) ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Have you raised any money so far  ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Are you in any big box stores / retailers  ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Do you have any subscription model ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="">
                  <Checkbox>Are there any competitors in market ?</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="displayDiv">
              <div><Statistic title="Valuation" value={112893} precision={2} /></div>
              <div className="percent-div">
                <Card title="Evaluation" style={{ width: 300 }}>
                  <Progress type="circle" percent={75} />
                </Card>
              </div>
           </div>
          </Content>
          <Footer></Footer>
        </Layout>
      </div>
    </div>
  );
}

export default App;
