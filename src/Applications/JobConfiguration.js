import React from "react";
import { PlayCircleOutlined, HighlightOutlined, DeleteOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { Table, Button, DatePicker, Select, Row, Col, Modal, List, Empty, notification, Popconfirm } from 'antd';
import Api from "../constants/api";

const { Option } = Select;

const dependentFileColumns = [{
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName'
},
{
    title: 'Version',
    dataIndex: 'version',
    key: 'version'
},
{
    title: 'Created By',
    dataIndex: 'createdBy',
    key: 'createdBy'
}, {
    title: 'Created On',
    dataIndex: 'createdOn',
    key: 'createdOn'
}]

const openNotificationWithIcon = (type, msg) => {
    notification[type]({
        message: 'Message',
        description: msg,
    });
};


class JobConfiguration extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            selectedJobID: "",
            dependentFileModal: false,
            jobList: [],
            selectedDate: new Date(),
            folderAccessData: [],
            masterFilePath: [],
            dependentFiles: [],
            jobConfigDetails: []
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    showDFModal = () => {
        this.setState({
            dependentFileModal: true,
        });
    };

    hideDFModal = () => {
        this.setState({
            dependentFileModal: false,
            masterFilePath: [],
            selectedJobID: ""
        });
    };

    componentDidMount() {
        this.getJobDetails();
    }

    getJobDetails = () => {
        Api.getAllJobs().then((response) => {
            this.setState({
                jobList: response.data
            })
        });
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    getJobConfigDetails = (jid) => {
        Api.jobConfigurationDetails(jid).then((response) => {
            this.setState({
                jobConfigDetails: response.data
            }, () => {
                this.showModal();
            })
        });
    }

    getManifestFiles = (rec) => {
        this.setState({
            selectedJobID: rec.jobId
        })
        this.showDFModal();
    }

    getFilesAll = () => {
        let data = { "date": "2021-01-01", "jobId": this.state.selectedJobID };
        Api.getJobHistory(data).then((response) => {
            this.setState({
                masterFilePath: response.data
            });
        });
    }

    runJob = (row) => {
        let params = { date: "2021-01-01", jobId: row.jobId };
        Api.runAJob(params).then(() => {
            openNotificationWithIcon('success', "Job Run Succesfully");
            this.getJobDetails();
        });
    }

    deleteJob = (row) => {
        let params = { jobId: row.jobId };
        Api.deleteJob(params).then(() => {
            openNotificationWithIcon('success', "Job Deleted Succesfully");
            this.getJobDetails();
        });
    }

    onDateChange = (date, dateString) => { console.log(date, dateString); }

    gotoAddJob = () => { window.location.hash = "#/jobConfiguraion/addNewJob"; }

    render() {
        const columns = [
            {
                title: 'Job ID',
                dataIndex: 'jobId',
                key: 'jobId',
                render: text => <a onClick={() => { this.getJobConfigDetails(text); }}>{text}</a>
            },
            {
                title: 'Job Name',
                dataIndex: 'jobName',
                key: 'jobName',
            },
            {
                title: 'Created By',
                dataIndex: 'createdBy',
                key: 'createdBy',
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
            },
            {
                title: 'Created On',
                dataIndex: 'createdOn',
                key: 'createdOn',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                render: (text, record) => <span className="jm-actions-tabl3">
                    <PlayCircleOutlined onClick={() => { this.runJob(record); }} />
                    <HighlightOutlined style={{ marginLeft: 5 }} onClick={() => { this.getManifestFiles(record); }} />
                    <Popconfirm placement="topLeft" title="Do you want to delete this Job ?"onConfirm={()=>{this.deleteJob(record);}} okText="Yes" cancelText="No">
                        <DeleteOutlined style={{ marginLeft: 5 }} />
                    </Popconfirm>
                </span>

            },
        ];

        return (

            <div className="job-managment">
                <Modal title="Job Config Details" visible={this.state.visible} onOk={this.hideModal} onCancel={this.hideModal} footer={[
                    <Button key="submit" type="primary" onClick={this.hideModal}>Ok</Button>]}>
                    <div>
                        {this.state.jobConfigDetails.map((row) => {
                            return (<List
                                size="small"
                                header={<h3>File : {row.fileName}</h3>}
                                bordered
                                dataSource={this.state.jobConfigDetails}
                                renderItem={item => <List.Item><Table dataSource={item.dependentFile} columns={dependentFileColumns} /></List.Item>}
                            />)
                        })}
                    </div>
                </Modal>
                <Modal title="Job History" visible={this.state.dependentFileModal} onOk={this.hideDFModal} onCancel={this.hideDFModal} footer={[
                    <Button key="submit" type="primary" onClick={this.hideDFModal}>Ok</Button>]}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <DatePicker onChange={this.onDateChange} />
                        </Col>
                        <Col span={6}>
                            <Button key="submit" type="primary" onClick={this.getFilesAll}>Get File</Button>
                        </Col>
                    </Row>
                    <Row gutter={24} className="margin-top-20">
                        <Col span={24}>
                            {this.state.masterFilePath.length > 0 ? this.state.masterFilePath.map((row) => {
                                return (<List
                                    size="small"
                                    header={<h3>File : {row.fileName}</h3>}
                                    bordered
                                    dataSource={this.state.masterFilePath}
                                    renderItem={item => <List.Item><Table dataSource={item.dependentFile} columns={dependentFileColumns} /></List.Item>}
                                />)
                            }) : <Empty />}
                        </Col>
                    </Row>
                </Modal>
                <Row gutter={24}>
                    <Col span={24}>
                        <h3><ToolOutlined /> Job Configuration</h3>
                        <p style={{ fontSize: 13 }}>Setup scalable SPACE and data integration jobs that can be run as immediate or scheduled to create output programatically.</p>
                    </Col>
                </Row>
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
                        <Button type="primary" icon={<PlusOutlined />} onClick={this.gotoAddJob} shape="round" style={{ marginTop: 30 }}>Configure Job</Button>
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-20">
                    <Col span={24}>
                        <Table dataSource={this.state.jobList} columns={columns} />
                    </Col>
                </Row>
            </div>);
    }
}
export default JobConfiguration;

