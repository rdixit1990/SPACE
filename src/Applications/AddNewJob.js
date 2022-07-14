import React from "react";
import { Input, Button, Select, Row, Col, List, Checkbox, notification, Radio, DatePicker } from 'antd';
import Api from "../constants/api";
import { ApiOutlined, FileTextTwoTone } from '@ant-design/icons';
//import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const { Option } = Select;

const openNotificationWithIcon = (type, msg) => {
    notification[type]({
        message: 'Message',
        description: msg,
    });
};

class AddNewJob extends React.Component {
    constructor() {
        super();
        this.state = {
            Jobfiles: [],
            selectedFiles: [],
            mainFileID: 0,
            defaultAddNewJobType: "newJob"
        }
    }

    componentDidMount() {
        Api.getFilesForJobCreate().then((response) => {
            this.setState({
                Jobfiles: response.data
            })
        })
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ items }) => ({
            selectedFiles: arrayMove(items, oldIndex, newIndex),
        }));
    };

    onChange = (checkedValues) => {
        checkedValues.map((item, index) => {
            item.order = `${index}`;
            item.type = "Dependent";
        })
        this.setState({
            selectedFiles: [...this.state.selectedFiles, checkedValues]
        });
    }

    onChangeMainFile = (e) => { this.setState({ mainFileID: e.target.value }) }

    onFinish = (values) => { console.log('Success:', values); };

    onFinishFailed = (errorInfo) => { console.log('Failed:', errorInfo); };

    onJobTypeChange = (value) => { this.setState({ jobType: value }); }

    onJobCategoryChange = (value) => { this.setState({ jobCategory: value }); }

    goBackToJobConfig = () => { window.location.hash = "#/jobConfiguraion" };

    handleChange = (e) => { const { name, value } = e.target; this.setState({ [name]: value }); }

    createNewJob = () => {
        let params = [{
            "category": this.state.jobCategory, "description": this.state.jobDescription, "fileId": this.state.mainFileID,
            "jobFileList": this.state.selectedFiles.flat(),
            "jobType": 1, "name": this.state.jobName, "order": 0
        }];
        Api.createJob(params).then(() => {
            openNotificationWithIcon('success', "Job Created Succesfully");
            this.goBackToJobConfig();
        });
    }

    onAddNewJobTypeChange = e => {
        this.setState({
            defaultAddNewJobType: e.target.value
        });
    }

    goBackToJbConfig = () => {
        window.location.hash = "#/jobConfiguraion";
    }

    render() {
        {/* const DragHandle = sortableHandle(() => <span><DragOutlined /></span>);
        const { selectedFiles } = this.state;
        const SortableItem = sortableElement(({ value }) => (
            value.map((element) => {
                return (<li className="margin-top-10">
                    <DragHandle />
                    <span><FileTextOutlined /><span style={{ marginLeft: 5 }}>{element.fileName}</span></span>
                </li>)
            })
        ));
        const SortableContainer = sortableContainer(({ children }) => {
            return <ul className="jobList">{children}</ul>;
        });*/}
        return (<div>
            <Row gutter={24}>
                <Col span={24}>
                    <h3><ApiOutlined /> New Job</h3>
                    <p style={{ fontSize: 13 }}>Setup scalable SPACE and data integration jobs that can be run as immediate or scheduled to create output programatically.</p>
                </Col>
            </Row>
            <hr></hr>
            <Row gutter={24}>
                <Col span={24}>
                    <Radio.Group defaultValue={this.state.defaultAddNewJobType} onChange={this.onAddNewJobTypeChange}>
                        <Radio value="newJob">Add new job</Radio>
                        <Radio value="newDIJob">Add new Data Ingestion Job</Radio>
                    </Radio.Group>
                </Col>
            </Row>
            { this.state.defaultAddNewJobType == "newJob" ? <div className="margin-top-20">
                <Row gutter={24}>
                    <Col span={6}>
                        <label>Job Name</label><br></br>
                        <Input placeholder="Please enter Job Name ..." className="margin-top-10" name="jobName" onChange={this.handleChange} />
                    </Col>
                    <Col span={12}>
                        <label>Job Description</label><br></br>
                        <Input.TextArea placeholder="Please enter Job Description ..." name="jobDescription" className="margin-top-10" onChange={this.handleChange} />
                    </Col>
                    <Col span={5}>
                        <label>Category</label><br></br>
                        <Select placeholder="Select Job Category" style={{ width: 200 }} name="jobCategory" onChange={this.onJobCategoryChange} className="margin-top-10">
                            <Option value="ADaM">ADaM</Option>
                            <Option value="TFLs">TFLs</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-10">
                    <Col span={6}>
                        <label>Job Type</label><br></br>
                        <Select placeholder="Select Job Type" style={{ width: 300 }} name="jobType" onChange={this.onJobTypeChange} className="margin-top-10">
                            <Option value="1">Ingest</Option>
                            <Option value="0">Normal</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <label>Study</label><br></br>
                        <Select placeholder="Select Study" style={{ width: 300 }} name="jobType" onChange={this.onJobTypeChange} className="margin-top-10">
                            <Option value="1">Study 1</Option>
                            <Option value="0">Study 2</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-20">
                    <Col span={12}>
                        <List
                            size="small"
                            pagination={{
                                pageSize: 5
                            }}
                            header={<div><h3>Choose Main Files</h3></div>}
                            bordered
                            dataSource={this.state.Jobfiles}
                            renderItem={item =>
                                <List.Item>
                                    <Radio.Group onChange={this.onChangeMainFile} value={this.state.mainFileID}>
                                        <Radio value={item.fileId}>
                                            <FileTextTwoTone /> <span style={{ color: "#1d3557" }}>{item.fileName}</span>
                                        </Radio>
                                    </Radio.Group>
                                    <br></br>
                                    <span style={{ color: "gray" }}>{item.path}</span>
                                </List.Item>}
                        />
                    </Col>
                    <Col span={12}>
                        <List
                            size="small"
                            pagination={{
                                pageSize: 5
                            }}
                            header={<div><h3>Choose Dependent Files</h3></div>}
                            bordered
                            dataSource={this.state.Jobfiles}
                            renderItem={item =>
                                <List.Item>
                                    <Checkbox.Group onChange={this.onChange}>
                                        <Checkbox value={item}>
                                            <FileTextTwoTone /> <span style={{ color: "#1d3557" }}>{item.fileName}</span>
                                        </Checkbox>
                                    </Checkbox.Group>
                                    <br></br>
                                    <span style={{ color: "gray" }}>{item.path}</span>
                                </List.Item>}
                        />
                    </Col>
                    {/*<Col span={12}>
                    {this.state.selectedFiles.length > 0 ? <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                            {selectedFiles.map((value, index) => (
                                <SortableItem key={`item-${value}`} index={index} value={value} />
                            ))}
                        </SortableContainer>: <Empty/>}
                       </Col>*/}
                </Row>
                <Row gutter={24} className="margin-top-20 margin-bottom-20">
                    <Col span={2}>
                        <Button type="primary" shape="round" onClick={this.createNewJob}>
                            Create Job
                    </Button>
                    </Col>
                    <Col span={3}>
                        <Button type="default" shape="round" onClick={this.goBackToJbConfig}>
                            Go Back
                    </Button>
                    </Col>
                </Row>
            </div> : <div>

                <Row gutter={24} className="margin-top-10">
                    <Col span={6}>
                        <label>Study</label><br></br>
                        <Input className="margin-top-10" name="jobName" value="SAM001-GAS001" />
                    </Col>
                    <Col span={6}>
                        <label>Job Name</label><br></br>
                        <Input className="margin-top-10" name="jobName" value="GAS01-SDTM" />
                    </Col>
                    <Col span={12}>
                        <label>Job Description</label><br></br>
                        <Input.TextArea value="GAS01-SDTM DMC Submission" name="jobDescription" className="margin-top-10" />
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-10">
                    <Col span={10}>
                        <label>Job Schedule</label><br></br>
                        <Select defaultValue="Weekly" style={{ width: 500 }} name="jobType" className="margin-top-10">
                            <Option value="1">Weekly</Option>
                            <Option value="0">Monthly</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>From</label><br></br>
                        <DatePicker className="margin-top-10" />
                    </Col>
                    <Col span={4}>
                        <label>To</label><br></br>
                        <DatePicker className="margin-top-10" />
                    </Col>
                    <Col span={4}>
                        <label>Time</label><br></br>
                        <DatePicker className="margin-top-10" />
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-20">
                    <Col span={10}>
                        <label>Target File Location</label><br></br>
                        <Input className="margin-top-10" name="jobName" value="...Global/Oncology/Gastric/SAM001/SAM001-GAS001/" />
                    </Col>
                    <Col span={4}>
                        <label>Source API</label><br></br>
                        <Select defaultValue="PDL Data Extract" style={{ width: 200 }} name="jobType" className="margin-top-10">
                            <Option value="1">Weekly</Option>
                            <Option value="0">Monthly</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>Version</label><br></br>
                        <Select defaultValue="Minor" style={{ width: 200 }} name="jobType" className="margin-top-10">
                            <Option value="1">Weekly</Option>
                            <Option value="0">Monthly</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24} className="margin-top-20 margin-bottom-20">
                    <Col span={2}>
                        <Button type="primary" shape="round" onClick={this.goBackToJbConfig}>
                            Create Job
                    </Button>
                    </Col>
                    <Col span={3}>
                        <Button type="default" shape="round" onClick={this.goBackToJbConfig}>
                            Go Back
                    </Button>
                    </Col>
                </Row>


            </div>}
        </div>)
    }
}

export default AddNewJob;