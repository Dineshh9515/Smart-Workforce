import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LocationForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    country: '',
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="e.g. Main Warehouse"
      />
      
      <Input
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
        placeholder="e.g. WH-001"
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="123 Industrial Ave"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="New York"
        />
        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="USA"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Location
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialData ? 'Update Location' : 'Create Location'}
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
