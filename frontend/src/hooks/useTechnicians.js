import { useState, useEffect, useCallback } from 'react';
import techniciansApi from '../api/techniciansApi';

const useTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTechnicians: 0
  });

  const fetchTechnicians = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await techniciansApi.getTechnicians(params);
      setTechnicians(data.technicians);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalTechnicians: data.totalTechnicians
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTechnician = async (data) => {
    setLoading(true);
    try {
      await techniciansApi.createTechnician(data);
      await fetchTechnicians(); // Refresh list
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTechnician = async (id, data) => {
    setLoading(true);
    try {
      await techniciansApi.updateTechnician(id, data);
      await fetchTechnicians();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTechnician = async (id) => {
    setLoading(true);
    try {
      await techniciansApi.deleteTechnician(id);
      await fetchTechnicians();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    technicians,
    loading,
    error,
    pagination,
    fetchTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician
  };
};

export default useTechnicians;
