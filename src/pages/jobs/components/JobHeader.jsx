// Job Header Component
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const JobHeader = ({ jobCount, onAddJob }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <Briefcase size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Job Management</h1>
            <p className="text-blue-100 text-sm font-medium">
              {jobCount} {jobCount === 1 ? 'job' : 'jobs'} posted
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddJob}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus size={20} />
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default JobHeader;

