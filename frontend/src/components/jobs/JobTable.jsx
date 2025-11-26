import React from 'react';
import Badge from '../common/Badge';
import { MdEdit, MdDelete, MdAssignmentInd, MdWarning } from 'react-icons/md';

const JobTable = ({ jobs, onEdit, onDelete, onAssign }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Technician</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Planned Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {jobs.map((job) => {
            const isOverdue = job.isOverdue;
            const isAtRisk = !isOverdue && job.dueAt && new Date(job.dueAt) < new Date(new Date().getTime() + 24 * 60 * 60 * 1000) && job.status !== 'Completed' && job.status !== 'Cancelled';
            
            return (
            <tr key={job._id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {isOverdue && <MdWarning className="text-red-500 mr-2" title="Overdue" />}
                  {isAtRisk && <MdWarning className="text-orange-500 mr-2" title="At Risk (Due < 24h)" />}
                  <div>
                    <div className="text-sm font-medium text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{job.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge label={job.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge label={job.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.location?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {job.technician ? job.technician.name : <span className="text-slate-400 italic">Unassigned</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div>{job.plannedDate ? new Date(job.plannedDate).toLocaleDateString() : '-'}</div>
                {job.dueAt && (
                  <div className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                    Due: {new Date(job.dueAt).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(job)}
                  className="text-slate-600 hover:text-slate-900"
                  title="Edit"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => onDelete(job._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Cancel/Delete"
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          );
          })}
          {jobs.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                No jobs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
