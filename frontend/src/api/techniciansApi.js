import axiosClient from './axiosClient';

const techniciansApi = {
  getTechnicians: (params) => axiosClient.get('/technicians', { params }),
  getTechnicianById: (id) => axiosClient.get(`/technicians/${id}`),
  createTechnician: (data) => axiosClient.post('/technicians', data),
  updateTechnician: (id, data) => axiosClient.put(`/technicians/${id}`, data),
  deleteTechnician: (id) => axiosClient.delete(`/technicians/${id}`),
};

export default techniciansApi;
