import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { FileTextOutlined,FolderOpenOutlined } from '@ant-design/icons';
import constants from "../constants/constants";
import Api from "../constants/api";

const { DirectoryTree } = Tree;

const initTreeData = [
  {
    "objectTypeId": 0,
    "objectId": 0,
    "status": 0,
    "actions": null,
    "title": "data",
    "name": "data/",
    "key": "0-0",
    "folder": true
  },
  {
    "objectTypeId": 0,
    "objectId": 0,
    "status": 0,
    "actions": null,
    "title": "global",
     "name":"global/",
    "key": "0-1",
    "folder": true
  }
];

function updateTreeData(list, key, children) {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return { ...node, children: updateTreeData(node.children, key, children) };
    }
    return node;
  });
}

const TreeStructure = () => {
  const [treeData, setTreeData] = useState(initTreeData);

  const getFolders = (key, prefix) => {
    window.location.hash = `#/repository/${key}*${prefix}`;
    let data = { key: key, prefix: prefix, userId: constants.USER_ID }, finals = [];
    Api.getFolders(data).then((response) => {
      response.data.objectStatus.map((item) => {
        if(item.folder == true) {
          item.isLeaf = false;
          item.icon = <FolderOpenOutlined />
        } else {
          item.isLeaf = true;
          item.icon = <FileTextOutlined />
        }
      });
      setTreeData((origin) =>
        updateTreeData(origin, key, response.data.objectStatus),
      )
    });
  }

  const onSelect = (selectedKeys, info) => {
    getFolders(info.node.key, info.node.name);
  };

  function onLoadData({ name, key, children }) {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        getFolders(key, name);
        resolve();
      }, 500);
    });
  }

  return <DirectoryTree multiple loadData={onLoadData} treeData={treeData} onSelect={onSelect}/>;
};

export default TreeStructure;