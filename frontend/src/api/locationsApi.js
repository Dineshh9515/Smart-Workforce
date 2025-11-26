import axiosClient from './axiosClient';

const locationsApi = {
  getLocations: () => axiosClient.get('/locations'),
  getLocationById: (id) => axiosClient.get(`/locations/${id}`),
  createLocation: (data) => axiosClient.post('/locations', data),
  updateLocation: (id, data) => axiosClient.put(`/locations/${id}`, data),
  deleteLocation: (id) => axiosClient.delete(`/locations/${id}`),
};

export default locationsApi;
