import { useState, useEffect, useCallback } from 'react';
import jobsApi from '../api/jobsApi';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsApi.getJobs(params);
      setJobs(data.jobs);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalJobs: data.totalJobs
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (data) => {
    setLoading(true);
    try {
      await jobsApi.createJob(data);
      await fetchJobs();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, data) => {
    setLoading(true);
    try {
      await jobsApi.updateJob(id, data);
      await fetchJobs();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignJob = async (id, data) => {
    setLoading(true);
    try {
      await jobsApi.assignJob(id, data);
      await fetchJobs();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    try {
      await jobsApi.deleteJob(id);
      await fetchJobs();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    createJob,
    updateJob,
    assignJob,
    deleteJob
  };
};

export default useJobs;
