import React from 'react';

const JobAssignmentSummary = ({ job, technician, asset }) => {
  if (!job || !technician) return null;

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
      <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-2">Assignment Summary</h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Job Title</p>
          <p className="font-medium text-slate-800">{job.title}</p>
        </div>
        <div>
          <p className="text-slate-500">Priority</p>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            job.priority === 'Critical' ? 'bg-red-100 text-red-800' :
            job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
            job.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
            'bg-slate-100 text-slate-800'
          }`}>
            {job.priority}
          </span>
        </div>
        
        <div>
          <p className="text-slate-500">Assigned Technician</p>
          <div className="flex items-center mt-1">
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
              {technician.name.charAt(0)}
            </div>
            <p className="font-medium text-slate-800">{technician.name}</p>
          </div>
        </div>

        <div>
          <p className="text-slate-500">Technician Skills</p>
          <p className="text-slate-800">{technician.skills.join(', ')}</p>
        </div>

        {asset && (
          <>
            <div>
              <p className="text-slate-500">Asset</p>
              <p className="font-medium text-slate-800">{asset.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="text-slate-800">{asset.location?.name || 'N/A'}</p>
            </div>
          </>
        )}

        <div className="col-span-2">
          <p className="text-slate-500">Planned Date</p>
          <p className="font-medium text-slate-800">
            {job.plannedDate ? new Date(job.plannedDate).toLocaleDateString() : 'Not scheduled'}
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mt-2">
        <p><strong>Note:</strong> Assigning this job will update the technician's status to "On Job" during the scheduled time.</p>
      </div>
    </div>
  );
};

export default JobAssignmentSummary;
