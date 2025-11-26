import React, { useEffect, useState } from 'react';
import useTechnicians from '../hooks/useTechnicians';
import useAssets from '../hooks/useAssets';
import useJobs from '../hooks/useJobs';
import jobsApi from '../api/jobsApi';
import assetDowntimeApi from '../api/assetDowntimeApi';
import activityLogsApi from '../api/activityLogsApi';
import Spinner from '../components/common/Spinner';
import { MdPeople, MdPrecisionManufacturing, MdWork, MdWarning, MdTimer, MdHistory } from 'react-icons/md';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className={`p-3 rounded-full ${color} text-white mr-4`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const DashboardPage = () => {
  const { technicians, fetchTechnicians, loading: techLoading } = useTechnicians();
  const { assets, fetchAssets, loading: assetLoading } = useAssets();
  const { jobs, fetchJobs, loading: jobLoading } = useJobs();
  
  const [stats, setStats] = useState({
    totalTechs: 0,
    availableTechs: 0,
    totalAssets: 0,
    downAssets: 0,
    totalJobs: 0,
    activeJobs: 0
  });

  const [jobSummary, setJobSummary] = useState(null);
  const [downtimeSummary, setDowntimeSummary] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetchTechnicians({ limit: 1000 });
    fetchAssets({ limit: 1000 });
    fetchJobs({ limit: 1000 });
    
    // Fetch new summaries
    jobsApi.getJobSummary().then(res => setJobSummary(res));
    jobsApi.getWorkloadSummary().then(res => setWorkload(res.slice(0, 5))); // Top 5 loaded techs
    assetDowntimeApi.getDowntimeSummary().then(res => setDowntimeSummary(res));
    activityLogsApi.getLogs({ limit: 10 }).then(res => setActivityLogs(res));
  }, [fetchTechnicians, fetchAssets, fetchJobs]);

  useEffect(() => {
    if (technicians.length && assets.length && jobs.length) {
      setStats({
        totalTechs: technicians.length,
        availableTechs: technicians.filter(t => t.status === 'Available').length,
        totalAssets: assets.length,
        downAssets: assets.filter(a => a.status === 'Down' || a.status === 'Under Maintenance').length,
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => ['Assigned', 'In Progress'].includes(j.status)).length
      });
    }
  }, [technicians, assets, jobs]);

  const isLoading = techLoading || assetLoading || jobLoading;

  if (isLoading && !technicians.length) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  // Get today's jobs
  const today = new Date().toISOString().split('T')[0];
  const todaysJobs = jobs.filter(j => j.plannedDate && j.plannedDate.startsWith(today));

  // Get critical assets
  const criticalAssets = assets.filter(a => a.criticality === 'High' && a.status !== 'Operational');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Technicians" 
          value={stats.totalTechs} 
          icon={MdPeople} 
          color="bg-blue-500" 
          subtext={`${stats.availableTechs} Available`}
        />
        <StatCard 
          title="Total Assets" 
          value={stats.totalAssets} 
          icon={MdPrecisionManufacturing} 
          color="bg-indigo-500" 
          subtext={`${stats.downAssets} Down/Maint`}
        />
        <StatCard 
          title="Active Jobs" 
          value={stats.activeJobs} 
          icon={MdWork} 
          color="bg-green-500" 
          subtext={`${stats.totalJobs} Total`}
        />
        <StatCard 
          title="Overdue Jobs" 
          value={jobSummary?.overdueJobsCount || 0} 
          icon={MdWarning} 
          color="bg-red-500" 
          subtext={`${jobSummary?.atRiskJobs?.length || 0} At Risk (24h)`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: At Risk & Overdue */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">At Risk Jobs (Next 24h)</h3>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {jobSummary?.atRiskJobs?.length || 0}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {jobSummary?.atRiskJobs?.length > 0 ? (
                jobSummary.atRiskJobs.slice(0, 5).map(job => (
                  <div key={job._id} className="px-6 py-3 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{job.title}</p>
                        <p className="text-xs text-slate-500">Due: {new Date(job.dueAt).toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-bold text-orange-600">{job.priority}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500 text-sm">No jobs at risk</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Asset Downtime (30 Days)</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500">Total Downtime</span>
                <span className="text-xl font-bold text-slate-800">{downtimeSummary?.totalDowntimeHours?.toFixed(1) || 0} hrs</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Top Critical Assets Down</h4>
              <div className="space-y-2">
                {downtimeSummary?.topCriticalAssets?.length > 0 ? (
                  downtimeSummary.topCriticalAssets.map(item => (
                    <div key={item.assetId} className="flex justify-between text-sm">
                      <span className="text-slate-700 truncate w-2/3">{item.assetName}</span>
                      <span className="font-medium text-red-600">{item.totalDowntimeHours.toFixed(1)} hrs</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No critical downtime recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Workload & Today's Jobs */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Technician Workload</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {workload.length > 0 ? (
                workload.map(tech => (
                  <div key={tech.technicianId} className="px-6 py-3 hover:bg-slate-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-900 text-sm">{tech.technicianName}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        tech.totalActiveJobs > 5 ? 'bg-red-100 text-red-800' :
                        tech.totalActiveJobs > 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {tech.totalActiveJobs} Jobs
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          tech.totalActiveJobs > 5 ? 'bg-red-500' :
                          tech.totalActiveJobs > 2 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((tech.totalActiveJobs / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">No active workload data</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Today's Jobs</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {todaysJobs.length > 0 ? (
                todaysJobs.map(job => (
                  <div key={job._id} className="px-6 py-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{job.title}</p>
                        <p className="text-xs text-slate-500">{job.location?.name}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">No jobs planned for today</div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Activity Log & Critical Assets */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {activityLogs.length > 0 ? (
                activityLogs.map(log => (
                  <div key={log._id} className="px-6 py-3 hover:bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">{new Date(log.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-slate-800">{log.message}</p>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">No recent activity</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Critical Assets Attention</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {criticalAssets.length > 0 ? (
                criticalAssets.map(asset => (
                  <div key={asset._id} className="px-6 py-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.assetTag}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        {asset.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">No critical assets down</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
