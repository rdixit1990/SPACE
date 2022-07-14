import React from "react";
import { Table, Tag, Tabs, Drawer, Row, Button, Select, Col, Upload, notification, Modal, Popconfirm } from 'antd';
import {
    FolderOpenTwoTone, FileDoneOutlined, CloudUploadOutlined, FileTextTwoTone, FileSyncOutlined, ExclamationCircleOutlined,
    CopyOutlined, DiffOutlined, UploadOutlined, DownloadOutlined, DesktopOutlined, ContainerOutlined, ForkOutlined,
    DeleteOutlined, FormOutlined, ArrowLeftOutlined, SendOutlined, FileProtectOutlined, ExceptionOutlined, CheckOutlined,
    CloudDownloadOutlined, PlaySquareOutlined, HistoryOutlined, FileExcelOutlined
} from '@ant-design/icons';
import TreeStructure from "../Components/TreeStructure";
import constants from "../constants/constants";
import Api from "../constants/api";
import AceEditor from "react-ace";
import base64 from 'base-64';
import $ from "jquery";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";

const { Dragger } = Upload;

const openNotificationWithIcon = (type, msg) => {
    notification[type]({
        message: 'Message',
        description: msg,
    });
};

const fileHistoryCols = [{
    title: 'Version',
    dataIndex: 'version',
    key: 'version'
},
{
    title: 'Author',
    dataIndex: 'createdBy',
    key: 'createdBy'
},
{
    title: 'Created On',
    dataIndex: 'createdOn',
    key: 'createdOn'
},
{
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate'
}, {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate'
}]

class Repository extends React.Component {
    constructor() {
        super();
        this.state = { defaultMode: "javascript", historyData: [], modalVisible: false, isAllowToEdit: false, selectedFilename: "", fileContent: "", isFileOpen: false, visible: false, placement: 'right', size: 'large', fileUpload: {}, foldersList: [], editorDrawerVisible: false, editorData: { webEditors: [], rdpEditors: [] } };
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    showDrawer = () => { 
        this.setState({ 
            visible: true 
        },() => {
            if($(".ant-upload-list-item-info").length ==1) {
                $(".ant-upload-list-item-card-actions-btn").click();
            }
        }); 
    };
    onClose = () => { this.setState({ visible: false }); };
    showEDrawer = () => { this.setState({ editorDrawerVisible: true }); };
    onEClose = () => { this.setState({ editorDrawerVisible: false, }); };
    onChange = e => { this.setState({ placement: e.target.value, }); };

    componentWillMount() {
        this.unlisten = this.props.history.listen(() => {
            this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
        });
    }
    componentWillUnmount() { this.unlisten(); }
    componentDidMount() { this.getFolders("0", ""); }

    getFolders = (key, prefix) => {
        let data = { key: key, prefix: prefix, userId: constants.USER_ID };
        Api.getFolders(data).then((response) => { this.setState({ foldersList: response.data.objectStatus }) });
    }

    goToNext = (key, prefix, fileId, name) => {
        if (prefix.includes(".") == true) {
            Api.openFile(fileId).then((response) => {
                this.setState({
                    isFileOpen: true,
                    fileContent: response.data.fileContent,
                    selectedFilename: name,
                    defaultMode: this.getEditorMode(name),
                    isAllowToEdit: response.data.allowed
                });
            });
        } else {
            window.location.hash = `#/repository/${key}*${prefix}`;
            this.setState({
                isFileOpen: false,
                fileContent: "",
                selectedFilename: "",
                isAllowToEdit: false
            });
        }
    }

    getEditors = () => {
        Api.getEditors().then((response) => {
            this.setState({
                editorData: response.data
            }, () => {
                this.showEDrawer();
            })
        });
    }

    updateObjectStatusFn = (id, fd) => {
        let params = {
            "actionId": id,
            "objectId": fd.objectId,
            "objectType": fd.objectTypeId,
            "userId": constants.USER_ID
        };
        Api.updateObjectStatus(params).then((response) => {
            if (response.status == 200) {
                openNotificationWithIcon('success', "File Operation Performed Succesfully");
                this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
            }
        }).catch((error) => {
            openNotificationWithIcon('error', error);
        });
    }

    launchWorkpace = (name, type) => {
        let params = {
            relaunchWorkspace: false,
            userId: constants.USER_ID,
            workspaceName: name,
            workspaceType: type
        };
        Api.launchWorkspace(params).then((response) => {
            if (response.status == 201) {
                setTimeout(() => {
                    const URL = `http://${response.data.url}`;
                    window.open(URL, '_blank');
                }, 5000);
                this.onEClose();
            }
        });
    }

    handleChangeSMPC = (e) => {
        this.setState({
            fileUpload: e.file.originFileObj
        })
    }

    createFileUploadFn = () => {
        let formData = new FormData();
        formData.append('file', this.state.fileUpload);
        let params = {
            file: formData,
            path: `${window.location.hash.split("*")[1]}${this.state.fileUpload.name}`,
            userId: constants.USER_ID
        }
        Api.createFile(params).then((response) => {
            if (response.status == "201") {
                openNotificationWithIcon('success', "File Created Succesfully");
                this.setState({ fileUpload: {} });
                this.onClose();
                this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
            }
        }).catch((error) => {
            openNotificationWithIcon('error', "File already exists");

        })
    }

    saveFileChanges = () => {
        let params = {
            contents: base64.encode(this.state.fileContent),
            path: `${window.location.hash.split("*")[1]}${this.state.selectedFilename}`
        };
        Api.updateFileContent(params).then(() => {
            openNotificationWithIcon('success', "File Saved Succesfully");
            this.cancelChanges();
        });
    }

    cancelChanges = () => {
        this.setState({
            isFileOpen: false,
            fileContent: "",
            selectedFilename: "",
            updatedFileContent: "",
            isAllowToEdit: false
        }, () => {
            this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
        });
    }

    closeWorkspace = () => {
        Api.closeWorkspace(this.state.editorData.type).then(() => {
            this.onEClose();
            openNotificationWithIcon('success', "Workspace closed succesfully");
        })
    }

    runAfile = (item, record) => {
        let params = {
            date: new Date(),
            fileId: record.objectId
        };
        Api.runFile(params).then(() => {
            openNotificationWithIcon('success', "File Run Successfully");
            this.onClose();
            this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
        });
    }

    downloadAFile = (row) => {
        //row.objectId
        Api.downloadFile(row.objectId).then((response) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = "_blank";
            link.setAttribute('download', row.title); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
            openNotificationWithIcon('success', "File Downloaded Successfully");
        });
    }

    onEditorChange(newValue) {
        this.setState({
            fileContent: newValue
        });
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    hideModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    getHistory = (rowData) => {
        Api.fileHistory(rowData.objectId).then((response) => {
            this.setState({
                historyData: response.data
            }, () => {
                this.showModal();
            })
        })
    }

    getEditorMode = (filename) => {
        let mode = "";
        let ext = filename.substr(filename.lastIndexOf('.') + 1);
        if (ext == "js") {
            mode = "javascript";
        } else if (ext == "py") {
            mode = "python";
        } else if (ext == "java") {
            mode = "java";
        }
        return mode;
    }

    fileDeleteOps = (item, record) => {
        Api.fileDelete(record.objectId).then(() => {
            openNotificationWithIcon('success', "File Deleted Successfully");
            this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
        })
    }

    fileRejectCheckoutFn = (item, record) => {
        Api.fileRejectCheckout(record.objectId).then(() => {
            openNotificationWithIcon('success', "Reject Checkout Successfully");
            this.getFolders(window.location.hash.split("*")[0].split("/")[1], window.location.hash.split("*")[1]);
        })
    }

    render() {
        const { TabPane } = Tabs;
        const { Option } = Select;
        const { size } = this.state;
        const { placement, visible } = this.state;
        const callback = (key) => {
            console.log(key);
        }
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };

        const columns = [
            {
                title: 'Name',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => (
                    <div clas onClick={() => { this.goToNext(record.key, record.title, record.objectId, record.name); }}> {text.indexOf('.') !== -1 ? <FileTextTwoTone /> : <FolderOpenTwoTone />}
                        <span className="table-File">{text}</span></div>
                )
            },
            {
                title: 'Date Created',
                dataIndex: 'createdOn',
                key: 'createdOn',
            },
            {
                title: 'Author',
                dataIndex: 'createdBy',
                key: 'createdBy',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: item => item == "" ? "" : <Tag color={constants.masterData.statusColors[item]}>{constants.masterData.statusMaster[item]}</Tag>
            },
            {
                title: 'Operations',
                key: 'actions',
                render: (item, record) => (
                    <>
                        {item.actions && item.actions.length > 0 ? <span className="icntray">
                            {item.actions.map((item) => {
                                if (item == "11") {
                                    return (<FileExcelOutlined title="Cancel Checkout" onClick={() => { this.fileRejectCheckoutFn(item, record) }} />)
                                } else if (item == "10") {
                                    return (<HistoryOutlined title="File History" onClick={() => { this.getHistory(record); }} />)
                                } else if (item == "9") {
                                    return (<CloudDownloadOutlined title="Download" onClick={() => { this.downloadAFile(record); }} />)
                                } else if (item == "8") {
                                    return (<PlaySquareOutlined title="Run" onClick={() => { this.runAfile(item, record); }} />)
                                } else if (item == "7") {
                                    return (<FileProtectOutlined title="Validate" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                } else if (item == "6") {
                                    return (<ExceptionOutlined title="Reject" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                } if (item == "5") {
                                    return (<SendOutlined title="MOVE TO RFQ" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                } else if (item == "4") {
                                    return (<FormOutlined title="Rename" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                } if (item == "3") {
                                    return (<Popconfirm placement="topLeft" title="Do you want to delete this file ?" onConfirm={() => { this.fileDeleteOps(item, record); }} okText="Yes" cancelText="No">
                                        <DeleteOutlined />
                                    </Popconfirm>)
                                } else if (item == "2") {
                                    return (<FileSyncOutlined title="Check-Out" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                } else if (item == "1") {
                                    return (<FileDoneOutlined title="Check-In" onClick={() => { this.updateObjectStatusFn(item, record); }} />)
                                }
                            })}

                        </span> : ""}
                    </>
                ),
            },
        ];

        {/*const props = {
            beforeUpload: file => {
                let extArr = ["text/x-python", "application/x-sas", "", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
                if (!extArr.includes(file.type)) {
                    openNotificationWithIcon('error', "File formats supported .R, .py, .sas, .xlsx");
                }
                return extArr.includes(file.type) ? true : Upload.LIST_IGNORE;
            },
            onChange: info => { this.setState({ fileUpload: info.file.originFileObj }) },
        };*/}

        return (
            <div>
                <Modal title="File History" visible={this.state.modalVisible} onOk={this.hideModal} onCancel={this.hideModal}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.hideModal}>Ok</Button>]}>
                    <Table dataSource={this.state.historyData} columns={fileHistoryCols} pagination={{ pageSize: 3 }} />
                </Modal>
                <Drawer
                    title="Editors"
                    placement={this.state.placement}
                    closable={false}
                    onClose={this.onEClose}
                    visible={this.state.editorDrawerVisible}
                    key={placement}
                >
                    <div style={{ marginLeft: 50 }}>
                        {this.state.editorData.workspaceExists == false ? <>
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="Web Editors" key="1">
                                    <Row gutter={24}>
                                        {this.state.editorData.webEditors.map((item) => {
                                            return (<Col span={8} className="text-align-center workspace-col" onClick={() => { this.launchWorkpace(item, "WEB"); }}>
                                                <img src={constants.editors[item]} width={30} height={30} /><br></br>
                                                <span style={{ fontSize: 11, marginTop: 15, fontWeight: 400 }}>{constants.editorsNames[item]}</span>
                                            </Col>)
                                        })}
                                    </Row>
                                </TabPane>
                                <TabPane tab="RDP(s)" key="2">
                                    <Row gutter={24}>
                                        {this.state.editorData.rdpEditors.map((item) => {
                                            return (<Col span={8} className="text-align-center workspace-col" onClick={() => { this.launchWorkpace(item, "RDP"); }}>
                                                <img src={constants.editors[item]} width={30} height={30} /><br></br>
                                                <span style={{ fontSize: 11, marginTop: 15, fontWeight: 400 }}>{constants.editorsNames[item]}</span>
                                            </Col>)
                                        })}
                                    </Row>
                                </TabPane>
                            </Tabs>    <Row gutter={24} className="margin-top-30">
                                <Col span={24}>
                                    <Button shape="round" type="primary" size="default" icon={<CheckOutlined />} className="get-app-btn" onClick={this.onEClose}>Ok</Button>
                                </Col>
                            </Row></> : <Row gutter={24}>
                            <Col span={24}>
                                <span>Please close exisiting workspace by clicking "Close Workspace" button. You can resume workspace <a href={`http://${this.state.editorData.url}`} target="_blank">here</a>.</span><br></br>
                                <Button shape="round" type="primary" size="default" icon={<CheckOutlined />} className="get-app-btn margin-top-30" onClick={this.closeWorkspace}>Close Workspace</Button>
                            </Col>
                        </Row>}
                    </div>
                </Drawer>
                <Drawer
                    title="Creat New File"
                    placement={placement}
                    closable={false}
                    onClose={this.onClose}
                    visible={visible}
                    key={placement}
                >
                    <div style={{ marginLeft: 50 }}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Upload.Dragger name="files" onChange={this.handleChangeSMPC}   >
                                    <p className="ant-upload-drag-icon">
                                        <CloudUploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload file</p>
                                    {/*<p className="ant-upload-hint">File formats supported .R, .py, .sas</p>*/}
                                </Upload.Dragger>
                            </Col>
                        </Row>
                        <Row gutter={24} className="margin-top-40">
                            <Col span={24}>
                                <Button shape="round" type="primary" size="default" icon={<CloudUploadOutlined />} className="get-app-btn" onClick={this.createFileUploadFn}>Create New File</Button>
                            </Col>
                        </Row>
                    </div>
                </Drawer>
                <p style={{ fontSize: 13 }}>Create, edit, store datasets, programs, files associated with projects in a collaborative environment. Easily filter between your user space and global repository.</p>
                <Row gutter={24} className="repo-main-col">
                    <Col span={6} style={{ borderRight: '1px solid gray' }} className="directoryCol">
                        <TreeStructure />
                    </Col>
                    <Col span={18}>
                        {this.state.isFileOpen == false ? <Row gutter={24} className="tool-bar margin-top-10">
                            <Col span={16}>
                                <h3>My Files</h3>
                            </Col>
                            <Col span={8}>
                                <DiffOutlined title="New File" onClick={this.showDrawer} />
                                <CopyOutlined title="Copy File" />
                                <ExclamationCircleOutlined />
                                <UploadOutlined />
                                <ForkOutlined />
                                <DownloadOutlined title="Download" />
                                <ContainerOutlined />
                                <DesktopOutlined onClick={this.getEditors} title="Get Editor(s)" />
                            </Col>
                        </Row> : <><h2> <ArrowLeftOutlined onClick={this.cancelChanges} /> {this.state.selectedFilename}{this.state.isAllowToEdit == true ? "" : <Tag color="magenta" style={{ marginLeft: 10 }}>READ ONLY</Tag>}</h2></>}
                        {this.state.isFileOpen == true ?
                            <div className={this.state.isAllowToEdit == true ? "" : "disable-file-edit"}>
                                <Row gutter={24}><Col span={24}>
                                    <AceEditor
                                        //mode={()=>{this.getEditorMode(this.state.selectedFilename);}}
                                        mode={`${this.state.defaultMode}`}
                                        fontSize={15}
                                        theme="xcode"
                                        onChange={this.onEditorChange}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        value={`${this.state.fileContent}`}
                                        editorProps={{ $blockScrolling: true }}
                                        setOptions={{ enableSnippets: true, showLineNumbers: true, tabSize: 2 }}
                                    /> </Col></Row>
                                {this.state.isAllowToEdit == true ? <Row gutter={24} className="margin-top-20" style={{ marginBottom: 20 }}>
                                    <Col span={4}>
                                        <Button shape="round" type="primary" size="default" icon={<CheckOutlined />}
                                            className="get-app-btn" onClick={this.saveFileChanges}>Save Changes</Button>
                                    </Col>
                                    <Col span={6}>
                                        <Button shape="round" type="default" size="default"
                                            className="get-app-btn" onClick={this.cancelChanges}>Cancel</Button>
                                    </Col>
                                </Row> : ""}
                            </div> : <Table columns={columns} dataSource={this.state.foldersList} pagination={{ pageSize: 5 }} />}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Repository;