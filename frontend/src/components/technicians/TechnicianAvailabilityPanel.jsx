import React, { useState, useEffect } from 'react';
import useAvailability from '../../hooks/useAvailability';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import Select from '../common/Select';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import { MdDelete } from 'react-icons/md';

const TechnicianAvailabilityPanel = ({ technician }) => {
  const { availability, loading, fetchTechnicianAvailability, createAvailability, deleteAvailability } = useAvailability();
  const [newSlot, setNewSlot] = useState({
    date: '',
    shift: 'Full Day',
    isAvailable: true,
    reason: ''
  });

  useEffect(() => {
    if (technician) {
      fetchTechnicianAvailability(technician._id);
    }
  }, [technician, fetchTechnicianAvailability]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.date) return;

    const success = await createAvailability({
      technician: technician._id,
      ...newSlot
    });

    if (success) {
      setNewSlot({ date: '', shift: 'Full Day', isAvailable: true, reason: '' });
      fetchTechnicianAvailability(technician._id);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Are you sure you want to remove this slot?')) {
      await deleteAvailability(id);
      fetchTechnicianAvailability(technician._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Add Availability / Leave</h4>
        <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-1">
            <DatePicker
              name="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              required
              className="mb-0"
            />
          </div>
          <div className="md:col-span-1">
            <Select
              name="shift"
              value={newSlot.shift}
              onChange={(e) => setNewSlot({ ...newSlot, shift: e.target.value })}
              options={[
                { value: 'Full Day', label: 'Full Day' },
                { value: 'Morning', label: 'Morning' },
                { value: 'Afternoon', label: 'Afternoon' },
                { value: 'Night', label: 'Night' }
              ]}
              className="mb-0"
            />
          </div>
          <div className="md:col-span-1">
            <Select
              name="isAvailable"
              value={newSlot.isAvailable}
              onChange={(e) => setNewSlot({ ...newSlot, isAvailable: e.target.value === 'true' })}
              options={[
                { value: true, label: 'Available' },
                { value: false, label: 'Unavailable' }
              ]}
              className="mb-0"
            />
          </div>
          <div className="md:col-span-1">
            <Input
              name="reason"
              placeholder="Reason (optional)"
              value={newSlot.reason}
              onChange={(e) => setNewSlot({ ...newSlot, reason: e.target.value })}
              className="mb-0"
            />
          </div>
          <div className="md:col-span-1">
            <Button type="submit" size="md" className="w-full mb-4">Add</Button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Upcoming Slots</h4>
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Shift</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Reason</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {availability.map((slot) => (
                  <tr key={slot._id}>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {new Date(slot.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-500">{slot.shift}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-500">{slot.reason || '-'}</td>
                    <td className="px-4 py-2 text-right text-sm">
                      <button onClick={() => handleDeleteSlot(slot._id)} className="text-red-600 hover:text-red-800">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
                {availability.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-sm text-slate-500">
                      No availability slots recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianAvailabilityPanel;
