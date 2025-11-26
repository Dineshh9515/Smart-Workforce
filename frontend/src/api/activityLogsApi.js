import axiosClient from './axiosClient';

const activityLogsApi = {
  getLogs: (params) => axiosClient.get('/activity-logs', { params }),
};

export default activityLogsApi;
