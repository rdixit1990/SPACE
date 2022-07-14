import React from "react";
import { Steps, Row, Col, Form, Input, Button, Radio, Upload, List, Table, Select, notification, Tooltip, Divider } from 'antd';
import { CloudUploadOutlined, RightOutlined, LeftOutlined, MacCommandOutlined, CheckCircleTwoTone, CloseCircleTwoTone, EyeOutlined, SelectOutlined } from '@ant-design/icons';
import ApiService from "../constants/api";
import Inference from "./Inference";
const colFileResp = [
    {
        title: 'Column name',
        dataIndex: 'colNm',
        key: 'colNm'

    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'

    },
    {
        title: 'Byte Order',
        dataIndex: 'byteOrder',
        key: 'byteOrder'

    },
    {
        title: 'Distribution',
        dataIndex: 'distr',
        key: 'distr'

    },
]
const { Option } = Select;
class AutoMLExperiment extends React.Component {
    constructor() {
        super();
        this.state = {
            size: "default",
            expName: "",
            expType: "classification",
            colName: "",
            runCount: "",
            current: 0,
            selectFileName: "",
            createdDataSetFileArr: "",
            disableUpload: false,
            defaultAIMLtype:"Train"
        }
    }
    componentDidMount() {
        ApiService.getStoredFiles().then(res => {
            this.setState({
                fList: res.data || []
            })
        })
    }
    previewStoredFile = (e, fname, oname) => {
        ApiService.getPreviewFileData(fname).then(res => {
            this.csvToJson(res.data || []);
            this.setState({
                selectFileName: oname
            })
        })
    }
    previewSelectFile = (e, fullData) => {
        let colDyn = {};
        let colPre = [];
        let ob = JSON.parse(fullData.dtypes);
        Object.keys(ob).forEach(function (key) {
            colDyn = {
                colNm: [key][0],
                type: ob[key]["name"],
                distr: ""
            }
            colPre.push(colDyn);
        });
        const current = this.state.current + 1;
        this.setState({
            mapFileResp: colPre,
            current,
            selectFileName: fullData.original_file_name,
            disableUpload: true
        });
    }
    csvToJson = (csv) => {
        var lines = csv.split("\n");
        let colObj = {};
        var result = [];
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
        colObj = Object.keys(result[0]);

        let colFile = []
        Object.keys(colObj).forEach(function (key) {
            let colDyn = {
                title: colObj[key],
                dataIndex: colObj[key],
                key: colObj[key]
            }
            colFile.push(colDyn);

        });
        this.setState({
            dataFile: result || [],
            colFile: colFile
        });
    }
    callback(key) {
        console.log(key);
    }
    expTypeChange = e => {
        this.setState({
            expType: e.target.value,
        });
    };
    onFileChange = (info) => {
        console.log("filelist chk kr", info.fileList.length);
        if (info.fileList.length > 0) {
            this.setState({
                createdDataSetFileArr: info.fileList[0]["originFileObj"],

            });
        } else {
            this.setState({
                createdDataSetFileArr: "",

            });
        }

        //     console.log("abc", info.file.originFileObj);
        // console.log("&&", info.fileList, this.state.createdDataSetFileArr, this.state.createdDataSetFileArr.name.length);
    }
    next() {
        const formData = new FormData();
        formData.append("username", "anonymous");
        formData.append("file", this.state.createdDataSetFileArr);
        ApiService.createDataSetAutoML(formData).then(res => {
            let colPre = [];
            let colDyn = {};
            let ob = JSON.parse(res.data.data.dtypes);
            Object.keys(ob).forEach(function (key) {
                colDyn = {
                    colNm: [key][0],
                    type: ob[key]["name"],
                    byteOrder: ob[key]["byteorder"],
                    distr: ""
                }
                colPre.push(colDyn);
            });
            const current = this.state.current + 1;
            this.setState({
                mapFileResp: colPre,
                current
            });
        })
    }

    prev = () => {
        const current = this.state.current - 1;
        this.setState({ current, selectFileName: "", disableUpload: false });
    }
    onChangeAutoml = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    train = () => {
        let reqParms = {
            "experiment_name": this.state.expName,
            "task": this.state.expType,
            "file_name": this.state.createdDataSetFileArr ? this.state.createdDataSetFileArr.name : this.state.selectFileName,
            "target_column": this.state.colName,
            "run_count": this.state.runCount,
            "username": "anonymous"
        };
        if (this.state.expName == "" || this.state.runCount == "" || this.state.colName == "") {
            notification.open({
                message: 'Error',
                description:
                    'Please fill up mandatory fields',
                icon: <CloseCircleTwoTone style={{ color: '#108ee9' }} />,
                duration: 5,
            });
        } else {
            ApiService.trainSubmit(reqParms).then((output) => {
                notification.open({
                    message: 'Success',
                    description:
                        `${this.state.expName} has been submitted to the Queue. You will receive the notification on training completion.`,
                    icon: <CheckCircleTwoTone style={{ color: '#108ee9' }} />,
                    duration: 5,
                });
                window.location.href = "#/dashboard";
                //$("#dashboard").click();
            });
        }

    }
    onChangeTarget = (value) => {
        this.setState({
            colName: value
        });
    }
    firstContent = () => {
        return (
            <div className="create-exp-div">
                <Form >
                    <Row gutter={50} className="margin-top-20">
                        <Col span={12} >
                            <Form.Item label="Experiment Name" name="expName"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input placeholder="Enter experiment name" name="expName" onChange={(e) => this.onChangeAutoml(e)} value={this.state.expName} />
                            </Form.Item>
                        </Col>
                        <Col span={[12]}>
                            <Form.Item name="radio-group" label="Type">
                                <Radio.Group defaultValue={this.state.expType} name="expType" onChange={(e) => this.onChangeAutoml(e)} value={this.state.expType}>
                                    <Radio value="classification">Classification</Radio>
                                    <Radio value="regression">Regression</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="margin-top-20" gutter={16}>
                        <Col span={12} >
                            <Form.Item name="upload" label="Upload" name="upld"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Upload.Dragger onChange={this.onFileChange} className="upldHeight" multiple={false} disabled={this.state.disableUpload ? true : false}>
                                    <p className="ant-upload-drag-icon">
                                        <CloudUploadOutlined />                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item name="upload" label="Files" >
                                <List className="listHeight"
                                    size="small"
                                    bordered
                                    pagination={{
                                        pageSize: 5,
                                    }}

                                    dataSource={this.state.fList}
                                    renderItem={item => <List.Item>{item.original_file_name} <span className="preview">
                                        <Tooltip placement="top" title="Preview"><EyeOutlined className="mr-1" onClick={(e) => { this.previewStoredFile(e, item.file_name, item.original_file_name); }} /></Tooltip>
                                        {this.state.createdDataSetFileArr && this.state.createdDataSetFileArr.name && this.state.createdDataSetFileArr.name.length > 0 ? "" :
                                            <Tooltip placement="top" title="Select"><SelectOutlined className="ml-1" onClick={(e) => { this.previewSelectFile(e, item); }} /></Tooltip>
                                        }
                                    </span>
                                    </List.Item>}
                                />
                            </Form.Item>
                        </Col>
                        {this.state.dataFile && this.state.dataFile.length > 0 ?
                            <Col span={24}>
                                {/*  <label>File Name:</label><span className="fw-500"> {this.state.selectFileName}</span> */}
                                <Divider orientation="left">File Name: {this.state.selectFileName}</Divider>
                                <Table className="margin-top-10" dataSource={this.state.dataFile} columns={this.state.colFile} />
                            </Col> : ""}

                    </Row>
                </Form>
            </div>
        );
    }

    secondContent = () => {
        return (
            <Row span={24} gutter={50} className="margin-top-20">
                <Col span={10} >
                    <Form.Item label="Target Column" name="colName"
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                        <Select placeholder="Select Column Name" allowClear name="colName" onChange={this.onChangeTarget}>
                            {this.state.mapFileResp && this.state.mapFileResp.map((item, indx) => {
                                return <Option key={indx} value={item.colNm}>{item.colNm}</Option>;
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8} >
                    <Form.Item label="Row Count" name="runCount"
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                        <Input type="number" placeholder="Enter row count" name="runCount" onChange={(e) => this.onChangeAutoml(e)} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Table dataSource={this.state.mapFileResp} columns={colFileResp} />
                </Col>
            </Row>
        );
    }

    onTypeChange = e => {
        this.setState({
            defaultAIMLtype: e.target.value
        })
    }
    render() {
        const { Step } = Steps;
        const { current } = this.state;

        const steps = [
            {
                title: 'Create Dataset',
                content: this.firstContent(),
            },
            {
                title: 'Data Exploration & Model Configuration',
                content: this.secondContent(),
            }
        ];

        return (<div className="automl">
            <Row gutter={24}>
                <Col span={24}>
                    <Radio.Group defaultValue={this.state.defaultAIMLtype} onChange={this.onTypeChange}>
                        <Radio value="Train">Train</Radio>
                        <Radio value="Inference">Inference</Radio>
                    </Radio.Group>
                </Col>
            </Row>
            <hr className="margin-top-10"></hr>
           {this.state.defaultAIMLtype == "Train" ? <Row gutter={24} className="margin-top-20">
                <Col span={24}>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                    <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" shape="round" onClick={() => this.next()}>Next <span className="pl-1"><RightOutlined /></span></Button>
                        )}
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} shape="round" onClick={() => this.prev()}><span className="pr-1"><LeftOutlined /></span>  Previous  </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" shape="round" onClick={this.train}><span className="pr-1"><MacCommandOutlined /></span>  Train </Button>
                        )}

                    </div>
                </Col>
            </Row> : <Inference />}
        </div>)
    }
}
export default AutoMLExperiment;