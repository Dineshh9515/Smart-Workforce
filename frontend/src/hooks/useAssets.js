import { useState, useEffect, useCallback } from 'react';
import assetsApi from '../api/assetsApi';

const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssets: 0
  });

  const fetchAssets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetsApi.getAssets(params);
      setAssets(data.assets);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalAssets: data.totalAssets
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsset = async (data) => {
    setLoading(true);
    try {
      await assetsApi.createAsset(data);
      await fetchAssets();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (id, data) => {
    setLoading(true);
    try {
      await assetsApi.updateAsset(id, data);
      await fetchAssets();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id) => {
    setLoading(true);
    try {
      await assetsApi.deleteAsset(id);
      await fetchAssets();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assets,
    loading,
    error,
    pagination,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset
  };
};

export default useAssets;
