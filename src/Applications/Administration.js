import React from "react";
import { PlayCircleOutlined, HighlightOutlined, DeleteOutlined, FileUnknownTwoTone, CheckOutlined, FileDoneOutlined, SettingOutlined } from '@ant-design/icons';
import { Table, Statistic, Row, Col, Modal, Tag, Button } from 'antd';
import Api from "../constants/api";
import constants from "../constants/constants";

class Administration extends React.Component {
    constructor() {
        super();
        this.state = {
            templateList: [],
            visible: false,
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

    componentDidMount() {
        this.getAllTemplatesFn();
    }

    getAllTemplatesFn = () => {
        Api.getAllTemplates().then((response) => {
            this.setState({
                templateList: response.data
            },()=>{
                console.log("JAGDHGSADGHG===",this.state.templateList);
            })
        });
    }

    getFolderAcc = (id) => {
        window.location.hash =`#/admin/${id}`;
    }

    render() {
        const columns = [
            {
                title: 'Template ID',
                dataIndex: 'templateId',
                key: 'templateId',
                render: text => <a onClick={() => { this.getFolderAcc(text); }}>{text}</a>
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Created By',
                dataIndex: 'createdBy',
                key: 'createdBy',
            },
            {
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
            },
            {
                title: 'Created By',
                dataIndex: 'createdOn',
                key: 'createdOn',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                render: () => <span className="jm-actions-tabl3"><PlayCircleOutlined /><HighlightOutlined style={{ marginLeft: 5 }} /><DeleteOutlined style={{ marginLeft: 5 }} /></span>
            },
        ];
        return (<>
            <Modal title="Folder Access" visible={this.state.visible} onOk={this.hideModal} onCancel={this.hideModal} footer={[
                <Button key="submit" type="primary" onClick={this.hideModal}>
                    Ok
            </Button>
            ]}>
                <div><Table dataSource={this.state.folderAccessData} columns={this.state.folderAccessColumns} /></div>
            </Modal>
            <Row gutter={24}>
                <Col span={24}>
                    <h3><SettingOutlined /> Administration</h3>
                    <p style={{ fontSize: 13 }}>Manage system's folder structure templates, folder access configuration, and workflows that will be assigned to projects.</p>
                </Col>
            </Row>
            <Row gutter={16} className="margin-top-10">
                <Col span={12}>
                    <Statistic title="In Review" value={1128} prefix={<FileUnknownTwoTone />} />
                </Col>
                <Col span={12}>
                    <Statistic title="Approved" value={93} prefix={<FileDoneOutlined />} suffix="/ 100" />
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-10">
                <Col span={24}>
                    <Table dataSource={this.state.templateList} columns={columns} />
                </Col>
            </Row>
        </>)
    }
}

export default Administration;