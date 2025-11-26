import React from 'react';
import Badge from '../common/Badge';
import { MdEdit, MdDelete } from 'react-icons/md';

const AssetTable = ({ assets, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset Tag</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criticality</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {assets.map((asset) => (
            <tr key={asset._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{asset.assetTag}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{asset.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{asset.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{asset.location?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge label={asset.criticality} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge label={asset.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(asset)}
                  className="text-slate-600 hover:text-slate-900"
                  title="Edit"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => onDelete(asset._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                No assets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
