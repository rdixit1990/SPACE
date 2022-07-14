import React from "react";
import constants from "../constants/constants";
import { Table, Row, Col, Button,Tag } from 'antd';
import { SecurityScanOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Api from "../constants/api";

class FolderTemplate extends React.Component {
    constructor() {
        super();
        this.state = {
            folderAccessData: [],
            folderAccessColumns: []
        }
    }

    componentDidMount() {
        this.getFolderAcc();
    }

    backToAdmin = () => {
        window.location.hash = "#/admin";
    }

    getFolderAcc = () => {
        let columnsArr = [];
        Api.getFolderAccess(window.location.hash.split("/")[2]).then((response) => {
            if (response.data.length > 0) {
                let colsArr = Object.keys(response.data[0]);
                colsArr.forEach((item) => {
                    columnsArr.push({ title: constants.roleName[item], dataIndex: item, key: item, });
                });
                columnsArr.push({title:'Versionable',dataIndex:'versionable', key:'versionable', render: text => <Tag color="#74c69d">{text}</Tag>})
                response.data.map((item) => {
                    item.versionable = "YES";
                })
                this.setState({
                    folderAccessData: response.data,
                    folderAccessColumns: columnsArr,
                });
            } else {
                this.setState({
                    folderAccessData: [],
                    folderAccessColumns: [],
                });
            }
        });
    }


    render() {
        return (<div>
            <Row gutter={24}>
                <Col span={24}>
                    <h3><SecurityScanOutlined /> Folder Template Access</h3>
                    <p style={{ fontSize: 13 }}>Manage system's folder structure templates, folder access configuration, and workflows that will be assigned to projects.</p>
                </Col>
            </Row>
            <Row gutter={24} className="margin-top-20">
                <Col span={24}>
                    <Table dataSource={this.state.folderAccessData} columns={this.state.folderAccessColumns} />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Button shape="round" type="primary" size="default" icon={<ArrowLeftOutlined />} className="get-app-btn" onClick={this.backToAdmin}>Back</Button>
                </Col>
            </Row>
        </div>)
    }
}

export default FolderTemplate;