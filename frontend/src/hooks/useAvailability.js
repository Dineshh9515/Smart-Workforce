import { useState, useCallback } from 'react';
import availabilityApi from '../api/availabilityApi';

const useAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await availabilityApi.getAvailability(params);
      setAvailability(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTechnicianAvailability = useCallback(async (technicianId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await availabilityApi.getTechnicianAvailability(technicianId, params);
      setAvailability(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAvailability = async (data) => {
    setLoading(true);
    try {
      await availabilityApi.createAvailability(data);
      // Note: We might need to refetch depending on context, but usually the caller handles that
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (id, data) => {
    setLoading(true);
    try {
      await availabilityApi.updateAvailability(id, data);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id) => {
    setLoading(true);
    try {
      await availabilityApi.deleteAvailability(id);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    availability,
    loading,
    error,
    fetchAvailability,
    fetchTechnicianAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability
  };
};

export default useAvailability;
