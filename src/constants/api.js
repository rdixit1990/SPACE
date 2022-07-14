import axios from 'axios';
import constants from "./constants";
import $ from "jquery";

const getCsrfHeader = () => {
    return {
        headers: {
            //"Content-Type": "multipart/form-data"
            "X-CSRF-TOKEN": $("meta[name='_csrf']").attr("content")
        }
    };
};

export default class Api {

    /* Dashboard */
    static getFilesCount(){
        return axios.get(`${constants.REPO_API_ENDPOINT}dashboard/fileStatusCount`,constants.headers);
    }
    /* Ends here */

    /* Repo - Get Folders */
    static getFolders(data) {
        let url = data.prefix == "" ? axios.post(`${constants.REPO_API_ENDPOINT}repository/getFolders?key=${data.key}&userId=${data.userId}`,constants.headers) : axios.post(`${constants.REPO_API_ENDPOINT}repository/getFolders?key=${data.key}&prefix=${data.prefix}&userId=${data.userId}`,constants.headers)
        return url;
    }

    static updateObjectStatus(params) {
        let pms  = `actionId=${params.actionId}&objectId=${params.objectId}&objectType=${params.objectType}&userId=${params.userId}`;
        return axios.post(`${constants.WF_API_ENDPOINT}workflow/update?${pms}`,constants.headers);
    }

    static getEditors() {
        return axios.get(`${constants.REPO_API_ENDPOINT}/repository/getEditors?userId=${constants.USER_ID}`,constants.headers);
    }

    static closeWorkspace(wtype){
return axios.post(`${constants.REPO_API_ENDPOINT}repository/closeWorkspace?userId=${constants.USER_ID}&workspaceType=${wtype}`,constants.headers);
    }

    static launchWorkspace(params) {
        let uparam = `launchWorkspace?relaunchWorkspace=${params.relaunchWorkspace}&userId=${constants.USER_ID}&workspaceName=${params.workspaceName}&workspaceType=${params.workspaceType}`;
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/${uparam}`,constants.headers);
    }

    static createFile(data) {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/createFile?path=${data.path}&userId=${constants.USER_ID}`,data.file,constants.Fileheaders);
    }

    static openFile(fileId){
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/openfile?fileId=${fileId}&userId=${constants.USER_ID}`,constants.headers);
    }

    static runFile(params) {
        return axios.post(`${constants.JOB_ENDPOINT}job/runFile?date=${params.date}&fileId=${params.fileId}&userId=${constants.USER_ID}`,constants.headers);
    }

    static downloadFile(fileId) {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/fileDownload?fileId=${fileId}&userId=${constants.USER_ID}`,{ responseType: 'blob'},constants.downloadHeaders);
    }

    static updateFileContent(params) {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/updateContent?contents=${params.contents}&path=${params.path}&userId=${constants.USER_ID}`,constants.headers);
    }

    static fileHistory(fileId){
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/fileHistory?fileId=${fileId}`,constants.headers);
    }

    static fileDelete(fileId) {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/delete?fileId=${fileId}&userId=${constants.USER_ID}`,constants.headers);
    }

    static fileRejectCheckout(fileId) {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/delete?fileId=${fileId}&userId=${constants.USER_ID}`,constants.headers);
    }

    /* Job Service */

    static getJobCategoryCount(){
        return axios.get(`${constants.JOB_ENDPOINT}job/count/category`,constants.headers);
    }

    static jobCountMonthwise(){
        return axios.get(`${constants.JOB_ENDPOINT}job/count/monthwise`,constants.headers);
    }

    static getAllJobs(){
        return axios.post(`${constants.JOB_ENDPOINT}job/jobDetails?userId=${constants.USER_ID}`,constants.headers);
    }

    static getJobHistory(data){
        return axios.post(`${constants.JOB_ENDPOINT}job/jobHistory?date=${data.date}&jobId=${data.jobId}`,constants.headers);
    }

    static jobConfigurationDetails(jobId) {
        return axios.post(`${constants.JOB_ENDPOINT}job/jobConfigDetails?jobId=${jobId}`,constants.headers);
    }

    static getFilesForJobCreate() {
        return axios.post(`${constants.REPO_API_ENDPOINT}repository/jobFiles?userId=${constants.USER_ID}`,constants.headers);
    }

    static createJob(params) {
        return axios.post(`${constants.JOB_ENDPOINT}job/create?userId=${constants.USER_ID}`,params,constants.headers);
    }

    static getJobRunInstance(){
        return axios.get(`${constants.JOB_ENDPOINT}job/runInstance`,constants.headers);
    }

    static getJobCountMonthwise(){
        return axios.get(`${constants.JOB_ENDPOINT}job/count/monthwise`,constants.headers);
    }

    static runAJob(params){
        return axios.post(`${constants.JOB_ENDPOINT}job/run?date=${params.date}&jobId=${params.jobId}&userId=${constants.USER_ID}`,constants.headers);
    }

    static deleteJob(params) {
        return axios.post(`${constants.JOB_ENDPOINT}job/delete?jobId=${params.jobId}&userId=${constants.USER_ID}`,constants.headers);

    }

    /* Admin Templates */
    static getAllTemplates(){
        return axios.post(`${constants.REPO_API_ENDPOINT}template/listAll?userId=${constants.USER_ID}`,constants.headers);
    }

    static getFolderAccess(Id){
        return axios.post(`${constants.REPO_API_ENDPOINT}template/folderAccess?templateId=${Id}`,constants.headers);
    }

    static dwnldInference(filename) {
        let header = getCsrfHeader();
        header.headers["Content-Type"] = "multipart/form-data";
        header.headers["responseType"] = "arraybuffer";
        header.headers["Authorization"] = "Token NPZXBBRpHglep0GGxdHmGnD8Lsrm1m";
        let formData = new FormData();
        let file_name = filename.split('##')[0];
        formData.append('file_name', file_name);
        return axios.post(`${constants.AUTOML_API_URL}/download_file/inference`, formData, header);

    }
    static createDataSetAutoML(formData) {
        let header = getCsrfHeader();
        header.headers["Content-Type"] = "multipart/form-data";
        return axios.post(`${constants.AUTOML_API_URL}/upload`, formData, header);
    }

    static predictInference(formData) {
        let header = getCsrfHeader();
        header.headers["Content-Type"] = "multipart/form-data";
        return axios.post(`${constants.AUTOML_API_URL}/inference`, formData, header);
    }
    static trainSubmit(reqParams) {
        let header = getCsrfHeader();
        header.headers["Authorization"] = "Token NPZXBBRpHglep0GGxdHmGnD8Lsrm1m";
        return axios.post(`${constants.AUTOML_API_URL}/train`, reqParams, header);
    }
    static getStoredFiles() {
        let formData = new FormData();
        formData.append("username", "rohan.dixit@saama.com");
        let header = getCsrfHeader();
        header.headers["Content-Type"] = "multipart/form-data";
        return axios.post(`${constants.AUTOML_API_URL}/stored_files`, formData, header);
    }
    static getPreviewFileData(filename) {
        let formData = new FormData();
        formData.append("file_name", filename);
        let header = getCsrfHeader();
        header.headers["Content-Type"] = "multipart/form-data";
        header.headers["responseType"] = "arraybuffer";
        header.headers["Authorization"] = "Token NPZXBBRpHglep0GGxdHmGnD8Lsrm1m";
        return axios.post(`${constants.AUTOML_API_URL}/download_file/preview`, formData, header);
    }
    
    static userJobs() {
        let headers = {
            Authorization: "Token NPZXBBRpHglep0GGxdHmGnD8Lsrm1m"
        }
        let formData = new FormData();
        formData.append('username', 'anonymous');
        return axios.post(`${constants.AUTOML_API_URL}/user_jobs`, formData, headers);
    }
}
