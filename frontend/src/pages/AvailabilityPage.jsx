import React, { useEffect, useState } from 'react';
import useAvailability from '../hooks/useAvailability';
import useTechnicians from '../hooks/useTechnicians';
import Spinner from '../components/common/Spinner';
import Select from '../components/common/Select';
import DatePicker from '../components/common/DatePicker';

const AvailabilityPage = () => {
  const { availability, fetchAvailability, loading } = useAvailability();
  const { technicians, fetchTechnicians } = useTechnicians();
  
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]);

  useEffect(() => {
    fetchTechnicians({ limit: 100 });
  }, [fetchTechnicians]);

  useEffect(() => {
    const params = {
      startDate,
      endDate
    };
    if (technicianFilter) params.technicianId = technicianFilter;
    
    fetchAvailability(params);
  }, [technicianFilter, startDate, endDate, fetchAvailability]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Availability Overview</h2>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Technician"
            value={technicianFilter}
            onChange={(e) => setTechnicianFilter(e.target.value)}
            options={technicians.map(t => ({ value: t._id, label: t.name }))}
            placeholder="All Technicians"
          />
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-10" />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {availability.map((slot) => (
                <tr key={slot._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {slot.technician?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(slot.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{slot.shift}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{slot.reason || '-'}</td>
                </tr>
              ))}
              {availability.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    No availability records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;
