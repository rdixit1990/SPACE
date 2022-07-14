import React from "react";
import { Statistic, Row, Col, Table, Tag, Card, Drawer, Select, Empty } from 'antd';
import { RadarChartOutlined, ApiOutlined, LoadingOutlined, FileSyncOutlined, GithubOutlined, ExceptionOutlined, CloseCircleTwoTone, FileDoneOutlined, RocketOutlined, ExperimentOutlined, FallOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import { HighchartsChart, Chart, withHighcharts, YAxis, Title, Subtitle, Legend, ColumnSeries, PieSeries, Tooltip } from 'react-jsx-highcharts';
import Api from "../constants/api";
import constants from "../constants/constants";
import { Sparklines, SparklinesLine } from 'react-sparklines';

const { Option } = Select;


class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            fileCountData: [],
            dataPredictions: [],
            colPredictions: [],
            mlType: "Train",
            visible: false,
            placement: "right",
            autoMLResults: {
                jobs: [],
                status: {
                    train: {},
                    inference: {}
                },
            }
        }
    }

    componentDidMount() {
        this.getcount();
        this.getAutoMLData();
    }

    getcount = () => {
        Api.getFilesCount().then((response) => {
            this.setState({
                fileCountData: response.data
            })
        });
    }

    getAutoMLData = () => {
        let res = Api.userJobs();
        let resultShowArr = [];
        let resultShowObj = {};
        res.then((response) => {
            let chk = response.data.jobs.map((job, index) => {
                if (job.result && job.result.accuracy_score && job.job_type == "train") {
                    resultShowObj = {
                        key: index,
                        exp_name: job.exp_name,
                        file_name: job.file_used.split("_")[2],
                        status: job.status,
                        train_type: job.training_task_type,
                        description: job.status == "failed" ? job.reason : Math.floor(job.result.accuracy_score * 100),
                        time_taken: Math.floor(job.time_taken * 10)
                    };
                    resultShowArr.push(resultShowObj);
                }
            });
            this.setState({
                autoMLResults: response.data,
                resultShowArr: resultShowArr

            });
        });
    }


    processPieDataFromTable = (fullTabledata = []) => {
        let FinArr = [];
        fullTabledata.map((item) => {
            FinArr.push({
                "name": `${constants.masterData.statusMaster[item.status]} (${item.total})`,
                "y": item.total,
            });
        });
        return FinArr;
    };

    showDrawer = () => { this.setState({ visible: true }); };
    onClose = () => { this.setState({ visible: false }); };
    evaluateResults = (ty) => {
        this.setState({
            mlType: ty
        }, () => {
            this.showDrawer();
        })
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

        let colPredictions = []
        Object.keys(colObj).forEach(function (key) {
            //  console.log(key, colObj[key]);
            let colDyn = {
                title: colObj[key],
                dataIndex: colObj[key],
                key: colObj[key]
            }
            colPredictions.push(colDyn);

        });
        this.setState({
            dataPredictions: result || [],
            colPredictions: colPredictions
        });

    }

    getPredictions = (value) => {
        Api.dwnldInference(value).then((output) => {
            this.setState({
                dataPredictions: [],
                colPredictions: [],
            },() => {
                this.csvToJson(output.data || []);
            })
        });
    }


    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
            },
            {
                title: 'Job Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Created By',
                dataIndex: 'createdBy',
                key: 'createdBy',
            },
            {
                title: 'Type',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Date Created',
                dataIndex: 'dateCreated',
                key: 'dateCreated',
            },
            {
                title: 'Status',
                key: 'tags',
                dataIndex: 'tags',
                render: tags => (
                    <>
                        {tags.map(tag => {
                            let color = "";
                            if (tag === 'failed') {
                                color = 'volcano';
                            } else if (tag == "running") {
                                color = 'geekblue';
                            } else if (tag == "completed") {
                                color = 'green';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </>
                ),
            },
            {
                title: 'Actions',
                dataIndex: 'markasComplete',
                key: 'markasComplete',
                render: text => <Tag color="#87d068">Mark as complete</Tag>,
            },
        ];

        const data = [
            {
                key: '1',
                id: "SDTM1001",
                createdBy: "Ray Dalio (Programmer)",
                name: 'STDY-GAS01-SDTM (DMC 1 Cut-off)',
                address: 'Extraction',
                dateCreated: "01/12/2021 17:35 GMT",
                tags: ['failed'],
            },
            {
                key: '2',
                id: "ADAM1002",
                createdBy: "Ray Dalio (Programmer)",
                name: 'STDY-GAS01-ADaM (DMC 1 Cut-off)',
                address: 'Extraction',
                dateCreated: "03/21/2021 13:01 GMT",
                tags: ['completed'],
            },
            {
                key: '3',
                id: "INT0909",
                createdBy: "Phil Foden (Administrator)",
                name: 'CDH-STDY-GAS01',
                address: 'Data Integration',
                dateCreated: "08/02/2021 09:54 GMT",
                tags: ['completed'],
            }
        ];

        const evalTrianColumns = [
            {
                title: 'Experiment Name',
                dataIndex: 'exp_name',
                key: 'exp_name'
            }
            ,
            {
                title: 'Train type',
                dataIndex: 'train_type',
                key: 'train_type',
                render: text => text == "classification" ? <Tag color="#0077b6">{text.toUpperCase()}</Tag> : <Tag color="#a5a58d">{text.toUpperCase()}</Tag>
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: text => text == "success" ? <span style={{ fontSize: 25, color: "#2a9d8f" }}><FileDoneOutlined /></span> : <span style={{ fontSize: 25, color: "#9d0208" }}><ExceptionOutlined /></span>
            }
        ];

        return (<div className="site-statistic-demo-card">
            <Drawer title="Evaluate & Predict" placement="right" closable={false} onClose={this.onClose} visible={this.state.visible}>
                <div style={{ marginLeft: 25 }}>
                    {this.state.mlType == "Train" ? <Table dataSource={this.state.resultShowArr} columns={evalTrianColumns} className="margin-top-10" pagination={{ pageSize: 5 }} />
                        : <div>
                            <Select
                                placeholder="Select Model To See Result"
                                allowClear
                                style={{ marginLeft: 20 }}
                                onChange={this.getPredictions}
                            >

                                {this.state.autoMLResults.jobs && this.state.autoMLResults.jobs.filter(element => element.job_type ==
                                    "inference").map((item, indx) => {
                                        return <Option key={indx} value={item.file_used}>{item.exp_name}</Option>;
                                    })}
                            </Select>
                            {this.state.dataPredictions.length > 0 ?
                                <Table scroll={{ x: 10 }} pagination={{ pageSize: 5 }} dataSource={this.state.dataPredictions} columns={this.state.colPredictions} className="margin-top-20" />
                                : <Empty className="margin-top-20" />}
                        </div>}
                </div>
            </Drawer>
            <Row gutter={24}>
                <Col span={24}>
                    <h3><RadarChartOutlined /> Dashboard</h3>
                    <p style={{ fontSize: 13 }}>Create, edit, store datasets, programs, files associated with projects in a collaborative environment. Easily filter between your user space and global repository.</p>
                </Col>
            </Row>
            <Row gutter={24} >
                <Col span={4}>
                    <Statistic title="Pull Requests" value={1128} prefix={<ApiOutlined />} />
                </Col>
                <Col span={4}>
                    <Statistic title="Programmers" value={93} prefix={<GithubOutlined />} />
                </Col>
                <Col span={4}>
                    <Statistic title="Completed Tasks" value={1128} prefix={<FileDoneOutlined />} />
                </Col>
                <Col span={4}>
                    <Statistic title="Pending Tasks" value={93} suffix="/ 100" prefix={<FileSyncOutlined />} />
                </Col>
                <Col span={4}>
                    <Statistic title="Running Jobs" value={93} prefix={<LoadingOutlined />} />
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-30">
                <Col span={15} style={{ borderRight: '1px dashed #560bad' }}>
                    <h2 style={{ textAlign: 'center' }}>File Status Overview</h2>
                    <HighchartsChart colors={['#005f73', '#0a9396', '#e9d8a6', '#ee9b00', '#bb3e03']}>
                        <Chart />
                        <Legend />
                        <Tooltip />
                        <YAxis>
                            <PieSeries name="Number of file(s)" size={250} data={this.processPieDataFromTable(this.state.fileCountData)}
                                showInLegend={true} />
                        </YAxis>
                    </HighchartsChart>
                </Col>
                <Col span={9}>
                    <h3 className="text-align-center cursor-pointer" onClick={() => { this.evaluateResults("Train"); }}>AutoML - Train</h3>
                    <p style={{ fontSize: 12 }}>Training a model simply means learning (determining) good values for all the weights and the bias from labeled data.</p>
                    <Row gutter={16}>
                        <Col span={8} className="auto-ml-success">
                            <Card bordered={true}><Statistic title="Success" value={this.state.autoMLResults.status.train.success} prefix={<RocketOutlined />} />
                            </Card>
                        </Col>
                        <Col span={8} className="auto-ml-progress">
                            <Card bordered={true}><Statistic title="Trainings" value={this.state.autoMLResults.status.train.training} prefix={<ExperimentOutlined />} /> </Card>
                        </Col>
                        <Col span={8} className="auto-ml-failed">
                            <Card bordered={true}><Statistic title="Failed" value={this.state.autoMLResults.status.train.failed} prefix={<FallOutlined />} /></Card>
                        </Col>
                    </Row>
                    <h3 className="margin-top-40 text-align-center cursor-pointer" onClick={() => { this.evaluateResults("Inference"); }}>AutoML - Inference</h3>
                    <p style={{ fontSize: 12 }}>Machine learning (ML) inference is the process of running live data points into a machine learning algorithm (or “ML model”) to calculate an output such as a single numerical score</p>
                    <Row gutter={16}>
                        <Col span={8} className="auto-ml-success">
                            <Card bordered={true}><Statistic title="Success" value={this.state.autoMLResults.status.inference.success} prefix={<RocketOutlined />} /> </Card>
                        </Col>
                        <Col span={8} className="auto-ml-progress">
                            <Card bordered={true}><Statistic title="Trainings" value={this.state.autoMLResults.status.inference.training} prefix={<ExperimentOutlined />} /></Card>
                        </Col>
                        <Col span={8} className="auto-ml-failed">
                            <Card bordered={true}><Statistic title="Failed" value={this.state.autoMLResults.status.inference.failed} prefix={<FallOutlined />} /></Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-20">
                <Col span={24}>
                    <Table columns={columns} dataSource={data} />
                </Col>

            </Row>

        </div>);
    }
}

export default withHighcharts(Dashboard, Highcharts);

