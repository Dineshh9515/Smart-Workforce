import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import locationsApi from '../../api/locationsApi';

const TechnicianForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    primarySkill: '',
    skills: '',
    location: '',
    status: 'Available',
    shiftType: 'Day'
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
        skills: initialData.skills ? initialData.skills.join(', ') : ''
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
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.primarySkill) newErrors.primarySkill = 'Primary skill is required';
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

    const submitData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: 'Field Technician', label: 'Field Technician' },
            { value: 'Supervisor', label: 'Supervisor' },
            { value: 'Planner', label: 'Planner' },
            { value: 'Engineer', label: 'Engineer' },
            { value: 'Other', label: 'Other' }
          ]}
          error={errors.role}
          required
        />
        <Input
          label="Primary Skill"
          name="primarySkill"
          value={formData.primarySkill}
          onChange={handleChange}
          error={errors.primarySkill}
          required
        />
        <Input
          label="Other Skills (comma separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. Welding, Safety, PLC"
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
          label="Shift Type"
          name="shiftType"
          value={formData.shiftType}
          onChange={handleChange}
          options={[
            { value: 'Day', label: 'Day' },
            { value: 'Night', label: 'Night' },
            { value: 'Rotational', label: 'Rotational' }
          ]}
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Available', label: 'Available' },
            { value: 'On Job', label: 'On Job' },
            { value: 'On Leave', label: 'On Leave' },
            { value: 'Inactive', label: 'Inactive' }
          ]}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Technician</Button>
      </div>
    </form>
  );
};

export default TechnicianForm;
