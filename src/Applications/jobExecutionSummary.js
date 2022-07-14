import React from "react";
import { SearchOutlined, ThunderboltOutlined, DatabaseTwoTone,LoadingOutlined,CloudServerOutlined,CloudSyncOutlined } from '@ant-design/icons';
import { Table, Button,Select, Row, Col, Steps, Tag } from 'antd';
import Highcharts from 'highcharts';
import { HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, ColumnSeries, PieSeries, Tooltip } from 'react-jsx-highcharts';
import Api from "../constants/api";

const { Step } = Steps;
const { Option } = Select;
const plotOptions = {
    column: {
        stacking: 'normal',
        dataLabels: {
            enabled: false
        }
    }
}

const pieData = [{
    name: 'SDTM',
    y: 13,
    color: "#264653"
}, {
    name: 'ADaM',
    y: 23,
    color: "#2a9d8f"
}, {
    name: 'TFLs',
    y: 19,
    color: "#d4e09b"
},
{
    name: 'TLFs',
    y: 11,
    color: "#ca6702"
}, {
    name: 'Other',
    y: 8,
    color: "#e76f51"
}];

const dataSource = [
    {
        key: '1',
        id: 'J20062020',
        jname: "SPACE Execution Workflow",
        study: 'STD-100-29932',
        category: 'ADaM',
        stime: 'Mon Jun 14 2021 10:32:59',
        etime: 'Mon Jun 14 2021 10:32:59',
        status: 'DRAFT'

    },
    {
        key: '2',
        id: 'J20062021',
        jname: "SPACE Execution Workflow",
        study: 'STD-100-29933',
        category: 'SDTM',
        stime: 'Mon Jun 14 2021 10:32:59',
        etime: 'Mon Jun 14 2021 10:32:59',
        status: 'DRAFT'

    }, {
        key: '3',
        id: 'J20062023',
        jname: "SPACE Execution Workflow 2",
        study: 'STD-100-29933',
        category: 'TFLs',
        stime: 'Mon Jun 14 2021 10:32:59',
        etime: 'Mon Jun 14 2021 10:32:59',
        status: 'DRAFT'

    },
    {
        key: '4',
        id: 'J20062021',
        jname: "SPACE Execution Workflow 3",
        study: 'STD-100-299334',
        category: 'Other',
        stime: 'Mon Jun 14 2021 10:32:59',
        etime: 'Mon Jun 14 2021 10:32:59',
        status: 'DEVELOPMENT'

    }
];


const columns = [
    {
        title: 'Job Instance ID',
        dataIndex: 'jobInstanceId',
        key: 'jobInstanceId',
    },
    {
        title: 'Job ID',
        dataIndex: 'jobId',
        key: 'jobId',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => text == "Completed" ? <Tag color="#76c893">{text.toUpperCase()}</Tag> : <Tag color="#e56b6f">{text.toUpperCase()}</Tag>
    },
    {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'stime',
    },
    {
        title: 'Created  On',
        dataIndex: 'createdOn',
        key: 'createdOn',
    },
];

class jobManagement extends React.Component {
    constructor() {
        super();
        this.state = {
            jobCategoryCnt: [],
            jobCountMonthwise: [],
            runInstanceData: [],
            execSummary: {
                "month": [],
                "completed": [],
                "failed": [],
                "inprogress": []
            }
        }
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    processPieDataFromTable = (fullTabledata = []) => {
        let FinArr = [];
        fullTabledata.map((item) => {
            FinArr.push({
                "name": `${item.category} (${item.count})`,
                "y": item.count,
            });
        });
        return FinArr;
    };

    componentDidMount() {
        Api.getJobCategoryCount().then((response) => {
            this.setState({
                jobCategoryCnt: response.data
            });
        });
        Api.getJobRunInstance().then((response) => {
            this.setState({
                runInstanceData: response.data
            })
        });
        Api.getJobCountMonthwise().then((response) => {
            this.setState({
                execSummary: response.data
            })
        })
    }

    render() {
        return (<div className="job-managment">
            <Row gutter={24}>
                <Col span={24}>
                    <h3><ThunderboltOutlined />Job Execution Summay</h3>
                    <p style={{ fontSize: 13 }}>
                        View the details of an executed job, including parameters, scheduling, logs, and output.
                        </p>
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-10">
                <Col span={3}>
                    <h2>API Based</h2>
                </Col>
                <Col span={21}>
                    <Steps>
                        <Step status="finish" title="RAW" icon={<DatabaseTwoTone twoToneColor="#52b788"/>} description="20 Jun 2021 10:23:55"/>
                        <Step status="finish" title="Patient Data Lake" icon={<CloudServerOutlined />} description="21 Jun 2021 10:23:55"/>
                        <Step status="finish" title="Pre-Conformance" icon={<CloudSyncOutlined />} description="22 Jun 2021 10:23:55"/>
                        <Step status="wait" title="Conformance" icon={<LoadingOutlined />} description="In Progress"/>
                    </Steps>
                </Col>
            </Row>
            {/*<Row gutter={24} className="margin-top-10">
                <Col span={3}>
                    <h2>File Based</h2>
                </Col>
                <Col span={21}>
                    <Steps>
                        <Step status="finish" title="RAW" icon={<DatabaseTwoTone />} description="20 Jun 2021 10:23:55"/>
                        <Step status="wait" title="Patient Data Lake" icon={<LoadingOutlined />} description="In Progress"/>
                        <Step status="wait" title="Pre-Conformance" icon={<LoadingOutlined />} description="In Progress"/>
                        <Step status="wait" title="Conformance" icon={<LoadingOutlined />} description="In Progress"/>
                    </Steps>
                </Col>
    </Row>*/}
            {/*<Row gutter={24} className="margin-top-10">
                <Col span={4}>
                    <h2>File Based</h2>
                </Col>
                <Col span={20}>
                    <Steps>
                        <Step status="finish" title="RAW" icon={<DatabaseTwoTone />} />
                        <Step status="process" title="Patient Data Lake" icon={<DatabaseTwoTone />} />
                        <Step status="wait" title="Pre-Conformance" icon={<LoadingOutlined />} />
                        <Step status="wait" title="Conformance" icon={<LoadingOutlined />} />
                    </Steps>
                </Col>
    </Row>*/}
            <Row gutter={24} className="margin-top-30">
                <Col span={12} style={{ borderRight: '1px solid #023047' }}>
                    <h3 style={{ textAlign: 'center' }}>Execution Summary MoM</h3>
                    <HighchartsChart plotOptions={plotOptions}>
                        <Chart />
                        <Legend />
                        <Tooltip />
                        <XAxis categories={this.state.execSummary.month} >
                            <XAxis.Title>Month-Year</XAxis.Title>
                        </XAxis>
                        <YAxis>
                            <YAxis.Title>Status</YAxis.Title>
                            <ColumnSeries name="Completed" data={this.state.execSummary.completed} color="#52b69a" />
                            <ColumnSeries name="Failed" data={this.state.execSummary.failed} color="#e56b6f" />
                            <ColumnSeries name="Progress" data={this.state.execSummary.inprogress} color="#ffcb69" />
                        </YAxis>
                    </HighchartsChart>
                </Col>
                <Col span={12}>
                    <h3 style={{ textAlign: 'center' }}>Category(s) Distributions</h3>
                    <HighchartsChart colors={['#118ab2', '#a01a58']}>
                        <Chart />
                        <Legend />
                        <Tooltip />
                        <XAxis categories={['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']} />
                        <YAxis>
                            <PieSeries name="Number of Jobs" data={this.processPieDataFromTable(this.state.jobCategoryCnt)} size={300} showInLegend={false} />
                        </YAxis>
                    </HighchartsChart>
                </Col>
            </Row>
            <hr></hr>
            <Row gutter={24} className="margin-top-10">
                <Col span={5}>
                    <label>Job Type</label><br></br>
                    <Select style={{ width: 200, marginTop: 10 }} onChange={this.handleChange} placeholder="Job Type">
                        <Option value="SDTM">SDTM</Option>
                        <Option value="ADaM">ADaM</Option>
                        <Option value="TFLs">TFLs</Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <label>Job Schedule</label><br></br>
                    <Select style={{ width: 200, marginTop: 10 }} onChange={this.handleChange} placeholder="Job Schedule">
                        <Option value="Immediate">Immediate</Option>
                        <Option value="Daily">Daily</Option>
                        <Option value="Weekly">Weekly</Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <label>Job Status</label><br></br>
                    <Select style={{ width: 200, marginTop: 10 }} onChange={this.handleChange} placeholder="Job Status">
                        <Option value="Completed">Completed</Option>
                        <Option value="In Progress">In Progress</Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <label>Category</label><br></br>
                    <Select style={{ width: 200, marginTop: 10 }} onChange={this.handleChange} placeholder="Category">
                        <Option value="SDTM">SDTM</Option>
                        <Option value="ADaM">ADaM</Option>
                        <Option value="TFLs">TFLs</Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Button type="primary" icon={<SearchOutlined />} shape="round" style={{ marginTop: 30 }}>Search</Button>
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-20">
                <Col span={24}>
                    <Table dataSource={this.state.runInstanceData} columns={columns} />
                </Col>
            </Row>
        </div>);
    }
}
export default withHighcharts(jobManagement, Highcharts);

