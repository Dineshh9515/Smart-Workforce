import axiosClient from './axiosClient';

const availabilityApi = {
  getAvailability: (params) => axiosClient.get('/availability', { params }),
  getTechnicianAvailability: (technicianId, params) => axiosClient.get(`/availability/technician/${technicianId}`, { params }),
  createAvailability: (data) => axiosClient.post('/availability', data),
  updateAvailability: (id, data) => axiosClient.put(`/availability/${id}`, data),
  deleteAvailability: (id) => axiosClient.delete(`/availability/${id}`),
};

export default availabilityApi;
