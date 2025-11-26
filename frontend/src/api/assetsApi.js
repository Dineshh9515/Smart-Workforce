import axiosClient from './axiosClient';

const assetsApi = {
  getAssets: (params) => axiosClient.get('/assets', { params }),
  getAssetById: (id) => axiosClient.get(`/assets/${id}`),
  createAsset: (data) => axiosClient.post('/assets', data),
  updateAsset: (id, data) => axiosClient.put(`/assets/${id}`, data),
  deleteAsset: (id) => axiosClient.delete(`/assets/${id}`),
};

export default assetsApi;
