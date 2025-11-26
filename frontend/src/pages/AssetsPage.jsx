import React, { useEffect, useState } from 'react';
import useAssets from '../hooks/useAssets';
import AssetTable from '../components/assets/AssetTable';
import AssetForm from '../components/assets/AssetForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import locationsApi from '../api/locationsApi';

const AssetsPage = () => {
  const { assets, loading, fetchAssets, createAsset, updateAsset, deleteAsset } = useAssets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [locations, setLocations] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAssets();
    locationsApi.getLocations().then(data => {
      setLocations(data.map(l => ({ value: l._id, label: l.name })));
    });
  }, [fetchAssets]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (locationFilter) params.locationId = locationFilter;
    if (criticalityFilter) params.criticality = criticalityFilter;
    if (statusFilter) params.status = statusFilter;

    const timeoutId = setTimeout(() => {
      fetchAssets(params);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, locationFilter, criticalityFilter, statusFilter, fetchAssets]);

  const handleCreate = async (data) => {
    const success = await createAsset(data);
    if (success) setIsFormOpen(false);
  };

  const handleUpdate = async (data) => {
    const success = await updateAsset(selectedAsset._id, data);
    if (success) {
      setIsFormOpen(false);
      setSelectedAsset(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      await deleteAsset(id);
    }
  };

  const openCreateModal = () => {
    setSelectedAsset(null);
    setIsFormOpen(true);
  };

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Assets</h2>
        <Button onClick={openCreateModal}>Add Asset</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-0"
          />
          <Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            options={locations}
            placeholder="All Locations"
            className="mb-0"
          />
          <Select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' }
            ]}
            placeholder="All Criticalities"
            className="mb-0"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'Operational', label: 'Operational' },
              { value: 'Under Maintenance', label: 'Under Maintenance' },
              { value: 'Down', label: 'Down' },
              { value: 'Decommissioned', label: 'Decommissioned' }
            ]}
            placeholder="All Statuses"
            className="mb-0"
          />
        </div>
      </div>

      {loading && !assets.length ? (
        <Spinner size="lg" className="py-10" />
      ) : (
        <AssetTable
          assets={assets}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        title={selectedAsset ? 'Edit Asset' : 'Add Asset'}
        onClose={() => setIsFormOpen(false)}
      >
        <AssetForm
          initialData={selectedAsset}
          onSubmit={selectedAsset ? handleUpdate : handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AssetsPage;
