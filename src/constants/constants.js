const getEnv = () => {
  return "https://space.beta.lsac-dev.com";
}
const data = {
  REPO_API_ENDPOINT: `${getEnv()}:9010/`,
  WF_API_ENDPOINT: `${getEnv()}:9020/`,
  JOB_ENDPOINT: `${getEnv()}:9030/`,
  AUTOML_API_URL: 'https://apis.research.saama.com/automl-backend',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  Fileheaders: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data' 
  },
  downloadHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/octet-stream',
  },
  USER_ID: window.sessionStorage.getItem("user_id") || "Ranjeet",
  editors: {
    "VS_CODE": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1200px-Visual_Studio_Code_1.35_icon.svg.png",
    "JUPYTER_NOTEBOOK": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jupyter_logo.svg/1200px-Jupyter_logo.svg.png",
    "SAS": "data:image/png;base64,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",
    "R_STUDIO":"data:image/png;base64,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"
  },
  editorsNames: {
    "VS_CODE": "Visual Code",
    "JUPYTER_NOTEBOOK": "Jupyter Notebook",
    "SAS": "SAS",
    "R_STUDIO": " R Studio"
  },
  roleName:{
    "path":"Path",
    "programmer":"Programmer",
    "validator":"Validator"
  },
  masterData: {
    "objectMaster": {
      "1": "code"
    },
    "statusMaster": {
      "1": "DEVELOPMENT",
      "2": "DRAFT",
      "3": "READY FOR QC",
      "4": "VALIDATED"
    },
    "conditionMaster": {
      "1": "ENTITY OWNER",
      "2": "ROLE PROGRAMMER",
      "3": "ROLE VALIDATOR"
    },
    "roleMaster": {
      "1": "Programmer",
      "2": "Validator"
    },
    "actionMaster": {
      "1": "CHECKIN",
      "2": "CHECKOUT",
      "3": "DELETE",
      "4": "RENAME",
      "5": "MOVE TO RFQ",
      "6": "REJECT",
      "7": "VALIDATE",
      "8": "RUN",
      "9": "DOWNLOAD",
      "10": "FILE HISTORY"
    },
    "processMaster": {
      "1": "CHECK IN FILE",
      "2": "CHECK OUT FILE"
    },
    "statusColors": {
      "1": "#2a6f97",
      "2": "#6c757d",
      "3": "#ffbf69",
      "4": "#40916c"
    },
    "folderAccessRole":{
      "Programmer":"#2a6f97",
      "Validator":"#40916c",
    }
  }
}

export default data;