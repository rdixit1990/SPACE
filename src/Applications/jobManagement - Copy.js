import React from "react";
import { BarChartOutlined, SlidersOutlined , ClockCircleOutlined , PlusOutlined , ExperimentTwoTone} from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Tabs,
    Row, Col, Card, Tag
} from 'antd';
import { Sparklines, SparklinesLine } from 'react-sparklines';



class jobManagement extends React.Component {
    constructor() {
        super();
    }


    render() {
        const { TabPane } = Tabs;
        const callback = (key) => {
            console.log(key);
        }

        return (<div className="job-managment">
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={<span><BarChartOutlined />Job Execution Summary</span>} key="1">
                {/*<Button type="primary" size="large" icon={<PlusOutlined/>}>
                Configure new job
            </Button> */}

<p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five cen
                </p>
            
                       <Row className="margin-top-20">
                        <Col span={8}><div>
                            <Card title="#991 PACE Job" bordered={true} style={{ width: 400 }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>
                                <p> <Tag color="red">FAILED</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>
                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="indianred" />
                    </Sparklines>
                    </div>
                                </p>
                            </Card>
                            {/* <Form
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                                initialValues={{
                                    size: "small",
                                }}
                            >
                                <Form.Item label="Job Name">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Job Description">
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Job Type">
                                    <Select>
                                        <Select.Option value="demo">Immediate</Select.Option>
                                        <Select.Option value="demo">Daily</Select.Option>
                                        <Select.Option value="demo">Weekly</Select.Option>
                                        <Select.Option value="demo">Monthly</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Start Date">
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item label="End Date">
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item label="Time">
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item label=" Active / Inactive">
                                    <Switch />
                                </Form.Item>
                                <Form.Item>
                                    <Button>Submit</Button>
                                </Form.Item>
                            </Form>*/}
                        </div></Col>
                        <Col span={8} >
                            <Card title="#992 Data Ingestion Job" bordered={true} style={{ width: 400 }}>
                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>
                                <p> <Tag color="#2db7f5">RUNNING</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>
                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="#2db7f5" />
                    </Sparklines>
                    </div>
                                </p>



                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card title="#993 Scheduled Job" bordered={true} style={{ width: 400 }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>
                                <p> <Tag color="green">SUCCESS</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>
                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="green" />
                    </Sparklines>
                    </div>
                                </p>


                            </Card>
                        </Col>

                    </Row>
                    
                    <Row className="margin-top-30">
                        <Col span={8}><div>
                            <Card title="#991 PACE Job" bordered={true} style={{ width: 400 }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>
                                <p> <Tag color="red">FAILED</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>
                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="indianred" />
                    </Sparklines>
                    </div>
                                </p>
                            </Card>
                            {/* <Form
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                                initialValues={{
                                    size: "small",
                                }}
                            >
                                <Form.Item label="Job Name">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Job Description">
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Job Type">
                                    <Select>
                                        <Select.Option value="demo">Immediate</Select.Option>
                                        <Select.Option value="demo">Daily</Select.Option>
                                        <Select.Option value="demo">Weekly</Select.Option>
                                        <Select.Option value="demo">Monthly</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Start Date">
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item label="End Date">
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item label="Time">
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item label=" Active / Inactive">
                                    <Switch />
                                </Form.Item>
                                <Form.Item>
                                    <Button>Submit</Button>
                                </Form.Item>
                            </Form>*/}
                        </div></Col>
                        <Col span={8} >
                            <Card title="#992 Data Ingestion Job" bordered={true} style={{ width: 400 }}>
                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>
                                <p> <Tag color="#2db7f5">RUNNING</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>

                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="#2db7f5" />
                    </Sparklines>
                    </div>
                                </p>



                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card title="#993 Scheduled Job" bordered={true} style={{ width: 400 }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry when an unknown printer took a galley.</p>

                                <p> <Tag color="green">SUCCESS</Tag> </p>
                                <p>< ExperimentTwoTone/>   SAM-GAS01</p>

                                <p> <ClockCircleOutlined/> 19th June 2020 10:32 PM</p>
                                <p>
                                <div className="margin-top-30"><Sparklines limit={5} data={[5, 10, 5, 20, 15, 12, 65, 27, 33, 90, 4, 312, 2]}>
                        <SparklinesLine color="green" />
                    </Sparklines>
                    </div>
                                </p>


                            </Card>
                        </Col>

                    </Row>
                     </TabPane>
                <TabPane tab={<span><SlidersOutlined />Job Configuration</span>} key="2">Content of Tab Pane 2</TabPane>
            </Tabs>

        </div>);
    }
}

export default jobManagement;