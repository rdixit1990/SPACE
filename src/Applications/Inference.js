import React from "react";
import { Form, Input, Upload, Button, Select , Checkbox , notification} from 'antd';
import { CloudUploadOutlined, QuestionCircleOutlined , CheckCircleTwoTone } from '@ant-design/icons';
import ApiService from "../constants/api";

class Inference extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experimentName: "",
            inferenceFileArr: [],
            successfulModel:"",
            isExplanationNeeded: false,
            autoMLResults: {
                jobs: [],
                status: {
                    train: {},
                    inference: {}
                },
            }
        }
    }

    componentDidMount(){
        this.getAutoMLData();
    }

    getAutoMLData  = () => {
        let res = ApiService.userJobs();
        res.then((response) => {
            this.setState({
                autoMLResults: response.data,
            });
        });
    }

    onFileChange = (info) => {
           this.setState({
            inferenceFileArr: info.file.originFileObj
        });
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ ...this.state, [name]: value }, () => {
        });
    }
    getAccSccussModel = (value)  => {
        this.setState({
            model_file: value
        });      
    }

    predictInferenceFunction = () => {
        const formData = new FormData();
        formData.append("exp_name", this.state.experimentName);
        formData.append("file", this.state.inferenceFileArr);
        formData.append("model_file", this.state.model_file || "f8360b8f-66f9-4051-8bf9-c622e1740c91.zip");
        formData.append("explanation", true);
        formData.append("username", "anonymous");
        let res = ApiService.predictInference(formData);
        res.then((output) => {
            console.log(output);
            if(output.status == 200) {
                notification.open({
                    message: 'Success',
                    description:
                        'Model selection successful',
                    icon: <CheckCircleTwoTone style={{ color: '#108ee9' }} />,
                    duration: 5,
                });
                window.location.hash = "#/dashboard";
            }
        });
    }


    render() {
        const layout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 24 },
        };
        const { Option } = Select;
        return (<div>

            <Form
                {...layout}
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    label="Experiment Name"
                    name="username"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="Enter Experiment name" name="experimentName" onChange={(e)=> {this.handleChange(e);}}/>
                </Form.Item>

                <Form.Item
                    name="upload"
                    label="Import Dataset"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Upload.Dragger onChange={this.onFileChange}>
                        <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item label="Model Selection" name="layout" name="model_file" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                    <Select style={{ width: 320 }} defaultValue="Select"  onChange={this.getAccSccussModel}>
                        {this.state.autoMLResults && this.state.autoMLResults.jobs.filter(item => item.status == "success").map((element) => {
                            return <Option key={element.job_id} value={element.result.model}>{element.exp_name}</Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item label="Explanation">
                    <Checkbox >Is Explanation Needed ?</Checkbox>
                </Form.Item>

                <Form.Item label="">
                    <Button type="primary" shape="round" icon={<QuestionCircleOutlined />} onClick={this.predictInferenceFunction}>Predict</Button>
                </Form.Item>
            </Form>

        </div>)
    }
}

export default Inference;