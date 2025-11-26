import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { MdEdit, MdDelete, MdEventAvailable } from 'react-icons/md';

const TechnicianTable = ({ technicians, onEdit, onDelete, onManageAvailability }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Skill</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {technicians.map((tech) => (
            <tr key={tech._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{tech.name}</div>
                    <div className="text-sm text-slate-500">{tech.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tech.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tech.primarySkill}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tech.location?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge label={tech.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onManageAvailability(tech)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Availability"
                >
                  <MdEventAvailable size={20} />
                </button>
                <button
                  onClick={() => onEdit(tech)}
                  className="text-slate-600 hover:text-slate-900"
                  title="Edit"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => onDelete(tech._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
          {technicians.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                No technicians found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TechnicianTable;
