import axiosClient from './axiosClient';

const assetDowntimeApi = {
  getDowntime: (params) => axiosClient.get('/asset-downtime', { params }),
  getDowntimeById: (id) => axiosClient.get(`/asset-downtime/${id}`),
  createDowntime: (data) => axiosClient.post('/asset-downtime', data),
  updateDowntime: (id, data) => axiosClient.put(`/asset-downtime/${id}`, data),
  deleteDowntime: (id) => axiosClient.delete(`/asset-downtime/${id}`),
  getDowntimeSummary: (params) => axiosClient.get('/asset-downtime/summary', { params }),
};

export default assetDowntimeApi;
