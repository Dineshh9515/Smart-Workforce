import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import locationsApi from '../api/locationsApi';
import LocationTable from '../components/locations/LocationTable';
import LocationForm from '../components/locations/LocationForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationsApi.getLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDelete = async (location) => {
    if (!window.confirm(`Are you sure you want to delete ${location.name}?`)) return;
    
    try {
      await locationsApi.deleteLocation(location._id);
      fetchLocations();
    } catch (err) {
      alert('Failed to delete location');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingLocation) {
        await locationsApi.updateLocation(editingLocation._id, formData);
      } else {
        await locationsApi.createLocation(formData);
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            Locations
          </h1>
          <p className="text-gray-500 mt-1">Manage operational sites and warehouses</p>
        </div>
        <Button onClick={handleCreate} icon={FaPlus}>
          Add Location
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <LocationTable 
        locations={locations} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
      >
        <LocationForm
          initialData={editingLocation}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default LocationsPage;
