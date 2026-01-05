// Job Card Component
import React from 'react';
import { Building2, Tag, MapPin, DollarSign, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import { getCategoryDisplayName, getJobLocation, formatSalary } from '../utils/jobUtils';

const JobCard = ({ 
  job, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const location = getJobLocation(job);
  const category = getCategoryDisplayName(job.category);
  const salary = formatSalary(job.salary);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Job Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {job.title || 'Untitled Job'}
          </h3>
          <div className="flex items-center space-x-2">
            <Building2 size={16} className="text-purple-500" />
            <span className="text-sm text-gray-600">{job.spa?.name || '-'}</span>
          </div>
        </div>
        {job.isNewJob && (
          <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Tag size={16} className="text-blue-500" />
          <span>{category}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={16} className="text-green-500" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <DollarSign size={16} className="text-yellow-500" />
          <span>{salary}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} className="text-indigo-500" />
          <span>{job.applications?.length || 0} applications</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onView && onView(job)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => onEdit && onEdit(job)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
        <button
          onClick={() => onDelete && onDelete(job)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;

