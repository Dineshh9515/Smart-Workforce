import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import DatePicker from '../common/DatePicker';
import locationsApi from '../../api/locationsApi';
import assetsApi from '../../api/assetsApi';
import techniciansApi from '../../api/techniciansApi';
import availabilityApi from '../../api/availabilityApi';

const JobForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Planned',
    location: '',
    asset: '',
    technician: '',
    plannedDate: '',
    scheduledStart: '',
    scheduledEnd: ''
  });
  
  const [locations, setLocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [recommendedTechnicians, setRecommendedTechnicians] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch initial locations
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
        asset: initialData.asset?._id || initialData.asset || '',
        technician: initialData.technician?._id || initialData.technician || '',
        plannedDate: initialData.plannedDate ? initialData.plannedDate.split('T')[0] : '',
        scheduledStart: initialData.scheduledStart ? initialData.scheduledStart.split('T')[0] : '',
        scheduledEnd: initialData.scheduledEnd ? initialData.scheduledEnd.split('T')[0] : ''
      });
    }
  }, [initialData]);

  // Fetch assets and technicians when location changes
  useEffect(() => {
    if (formData.location) {
      const fetchAssetsAndTechs = async () => {
        try {
          const assetsData = await assetsApi.getAssets({ locationId: formData.location, limit: 100 });
          setAssets(assetsData.assets.map(a => ({ value: a._id, label: `${a.name} (${a.assetTag})` })));

          const techsData = await techniciansApi.getTechnicians({ locationId: formData.location, limit: 100 });
          setTechnicians(techsData.technicians.map(t => ({ value: t._id, label: t.name })));
        } catch (error) {
          console.error("Failed to fetch assets/techs", error);
        }
      };
      fetchAssetsAndTechs();
    } else {
      setAssets([]);
      setTechnicians([]);
    }
  }, [formData.location]);

  // Intelligent Suggestions Logic
  useEffect(() => {
    if (formData.location && formData.plannedDate) {
      const fetchRecommendations = async () => {
        try {
          // 1. Get technicians at this location
          const techsData = await techniciansApi.getTechnicians({ locationId: formData.location, status: 'Available', limit: 100 });
          const availableTechs = techsData.technicians;

          // 2. Check availability slots for these techs on the planned date
          const recommendations = [];
          
          for (const tech of availableTechs) {
            const slots = await availabilityApi.getTechnicianAvailability(tech._id, { 
              startDate: formData.plannedDate, 
              endDate: formData.plannedDate 
            });
            
            // If they have a slot and isAvailable is true
            const hasSlot = slots.some(slot => 
              new Date(slot.date).toISOString().split('T')[0] === formData.plannedDate && slot.isAvailable
            );

            if (hasSlot) {
              recommendations.push({ value: tech._id, label: `${tech.name} (Available)` });
            }
          }
          setRecommendedTechnicians(recommendations);
        } catch (error) {
          console.error("Failed to fetch recommendations", error);
        }
      };
      fetchRecommendations();
    } else {
      setRecommendedTechnicians([]);
    }
  }, [formData.location, formData.plannedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
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
        <div className="md:col-span-2">
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' }
          ]}
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Planned', label: 'Planned' },
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' }
          ]}
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
          label="Asset"
          name="asset"
          value={formData.asset}
          onChange={handleChange}
          options={assets}
          disabled={!formData.location}
          placeholder={!formData.location ? "Select Location first" : "Select Asset"}
        />
        <DatePicker
          label="Planned Date"
          name="plannedDate"
          value={formData.plannedDate}
          onChange={handleChange}
        />
        
        <div>
          <Select
            label="Technician"
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            options={technicians}
            disabled={!formData.location}
            placeholder={!formData.location ? "Select Location first" : "Select Technician"}
          />
          {recommendedTechnicians.length > 0 && (
            <div className="mt-1 text-xs text-green-600">
              <span className="font-semibold">Recommended:</span> {recommendedTechnicians.map(t => t.label.split(' (')[0]).join(', ')}
            </div>
          )}
        </div>

        <DatePicker
          label="Scheduled Start"
          name="scheduledStart"
          value={formData.scheduledStart}
          onChange={handleChange}
        />
        <DatePicker
          label="Scheduled End"
          name="scheduledEnd"
          value={formData.scheduledEnd}
          onChange={handleChange}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Job</Button>
      </div>
    </form>
  );
};

export default JobForm;
