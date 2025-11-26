import React, { useEffect, useState } from 'react';
import useJobs from '../hooks/useJobs';
import JobTable from '../components/jobs/JobTable';
import JobForm from '../components/jobs/JobForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import PillFilter from '../components/common/PillFilter';
import locationsApi from '../api/locationsApi';

const JobsPage = () => {
  const { jobs, loading, fetchJobs, createJob, updateJob, deleteJob } = useJobs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [locations, setLocations] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isOverdueFilter, setIsOverdueFilter] = useState(false);

  useEffect(() => {
    fetchJobs();
    locationsApi.getLocations().then(data => {
      setLocations(data.map(l => ({ value: l._id, label: l.name })));
    });
  }, [fetchJobs]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (locationFilter) params.locationId = locationFilter;
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (isOverdueFilter) params.isOverdue = 'true';

    const timeoutId = setTimeout(() => {
      fetchJobs(params);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, locationFilter, statusFilter, priorityFilter, isOverdueFilter, fetchJobs]);

  const handleCreate = async (data) => {
    const success = await createJob(data);
    if (success) setIsFormOpen(false);
  };

  const handleUpdate = async (data) => {
    const success = await updateJob(selectedJob._id, data);
    if (success) {
      setIsFormOpen(false);
      setSelectedJob(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel/delete this job?')) {
      await deleteJob(id);
    }
  };

  const openCreateModal = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Jobs</h2>
        <Button onClick={openCreateModal}>Create Job</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search title..."
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' }
            ]}
            placeholder="All Priorities"
            className="mb-0"
          />
          <div className="md:col-span-4 flex items-center flex-wrap gap-4">
             <div className="flex items-center">
               <span className="mr-2 text-sm text-slate-500">Status:</span>
               <PillFilter
                  options={[
                    { value: '', label: 'All' },
                    { value: 'Planned', label: 'Planned' },
                    { value: 'Assigned', label: 'Assigned' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                  active={statusFilter}
                  onChange={setStatusFilter}
               />
             </div>
             
             <button
                onClick={() => setIsOverdueFilter(!isOverdueFilter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isOverdueFilter 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                }`}
             >
               Overdue Only
             </button>
          </div>
        </div>
      </div>

      {loading && !jobs.length ? (
        <Spinner size="lg" className="py-10" />
      ) : (
        <JobTable
          jobs={jobs}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        title={selectedJob ? 'Edit Job' : 'Create Job'}
        onClose={() => setIsFormOpen(false)}
      >
        <JobForm
          initialData={selectedJob}
          onSubmit={selectedJob ? handleUpdate : handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default JobsPage;
