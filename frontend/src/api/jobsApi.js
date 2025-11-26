import axiosClient from './axiosClient';

const jobsApi = {
  getJobs: (params) => axiosClient.get('/jobs', { params }),
  getJobById: (id) => axiosClient.get(`/jobs/${id}`),
  createJob: (data) => axiosClient.post('/jobs', data),
  updateJob: (id, data) => axiosClient.put(`/jobs/${id}`, data),
  assignJob: (id, data) => axiosClient.patch(`/jobs/${id}/assign`, data),
  deleteJob: (id) => axiosClient.delete(`/jobs/${id}`),
  getJobSummary: () => axiosClient.get('/jobs/summary'),
  getWorkloadSummary: (params) => axiosClient.get('/jobs/workload-summary', { params }),
};

export default jobsApi;
