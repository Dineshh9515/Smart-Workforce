import React, { useEffect, useState } from 'react';
import useTechnicians from '../hooks/useTechnicians';
import TechnicianTable from '../components/technicians/TechnicianTable';
import TechnicianForm from '../components/technicians/TechnicianForm';
import TechnicianAvailabilityPanel from '../components/technicians/TechnicianAvailabilityPanel';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import PillFilter from '../components/common/PillFilter';
import locationsApi from '../api/locationsApi';

const TechniciansPage = () => {
  const { technicians, loading, fetchTechnicians, createTechnician, updateTechnician, deleteTechnician } = useTechnicians();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [locations, setLocations] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTechnicians();
    locationsApi.getLocations().then(data => {
      setLocations(data.map(l => ({ value: l._id, label: l.name })));
    });
  }, [fetchTechnicians]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (locationFilter) params.locationId = locationFilter;
    if (statusFilter) params.status = statusFilter;
    
    // Debounce search could be added here
    const timeoutId = setTimeout(() => {
      fetchTechnicians(params);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, locationFilter, statusFilter, fetchTechnicians]);

  const handleCreate = async (data) => {
    const success = await createTechnician(data);
    if (success) setIsFormOpen(false);
  };

  const handleUpdate = async (data) => {
    const success = await updateTechnician(selectedTech._id, data);
    if (success) {
      setIsFormOpen(false);
      setSelectedTech(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this technician?')) {
      await deleteTechnician(id);
    }
  };

  const openCreateModal = () => {
    setSelectedTech(null);
    setIsFormOpen(true);
  };

  const openEditModal = (tech) => {
    setSelectedTech(tech);
    setIsFormOpen(true);
  };

  const openAvailabilityModal = (tech) => {
    setSelectedTech(tech);
    setIsAvailabilityOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Technicians</h2>
        <Button onClick={openCreateModal}>Add Technician</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or email..."
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
          <div className="flex items-center">
             <PillFilter
                options={[
                  { value: '', label: 'All' },
                  { value: 'Available', label: 'Available' },
                  { value: 'On Job', label: 'On Job' },
                  { value: 'On Leave', label: 'On Leave' }
                ]}
                active={statusFilter}
                onChange={setStatusFilter}
             />
          </div>
        </div>
      </div>

      {loading && !technicians.length ? (
        <Spinner size="lg" className="py-10" />
      ) : (
        <TechnicianTable
          technicians={technicians}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onManageAvailability={openAvailabilityModal}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        title={selectedTech ? 'Edit Technician' : 'Add Technician'}
        onClose={() => setIsFormOpen(false)}
      >
        <TechnicianForm
          initialData={selectedTech}
          onSubmit={selectedTech ? handleUpdate : handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAvailabilityOpen}
        title={`Availability: ${selectedTech?.name}`}
        onClose={() => setIsAvailabilityOpen(false)}
      >
        <TechnicianAvailabilityPanel technician={selectedTech} />
      </Modal>
    </div>
  );
};

export default TechniciansPage;
