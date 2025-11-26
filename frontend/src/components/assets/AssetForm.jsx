import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import locationsApi from '../../api/locationsApi';

const AssetForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    type: '',
    location: '',
    criticality: 'Medium',
    status: 'Operational',
    lastMaintenanceDate: '',
    nextMaintenanceDue: ''
  });
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationsApi.getLocations();
        setLocations(data.map(loc => ({ value: loc._id, label: loc.name })));
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchLocations();

    if (initialData) {
      setFormData({
        ...initialData,
        location: initialData.location?._id || initialData.location || '',
        lastMaintenanceDate: initialData.lastMaintenanceDate ? initialData.lastMaintenanceDate.split('T')[0] : '',
        nextMaintenanceDue: initialData.nextMaintenanceDue ? initialData.nextMaintenanceDue.split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.assetTag) newErrors.assetTag = 'Asset Tag is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Asset Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          label="Asset Tag"
          name="assetTag"
          value={formData.assetTag}
          onChange={handleChange}
          error={errors.assetTag}
          required
        />
        <Input
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          required
          placeholder="e.g. Compressor, Pump"
        />
        <Select
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          options={locations}
          error={errors.location}
          required
        />
        <Select
          label="Criticality"
          name="criticality"
          value={formData.criticality}
          onChange={handleChange}
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' }
          ]}
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Operational', label: 'Operational' },
            { value: 'Under Maintenance', label: 'Under Maintenance' },
            { value: 'Down', label: 'Down' },
            { value: 'Decommissioned', label: 'Decommissioned' }
          ]}
        />
        <DatePicker
          label="Last Maintenance"
          name="lastMaintenanceDate"
          value={formData.lastMaintenanceDate}
          onChange={handleChange}
        />
        <DatePicker
          label="Next Maintenance Due"
          name="nextMaintenanceDue"
          value={formData.nextMaintenanceDue}
          onChange={handleChange}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Asset</Button>
      </div>
    </form>
  );
};

export default AssetForm;
