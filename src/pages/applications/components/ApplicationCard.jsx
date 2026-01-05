// Application Card Component (Mobile)
import React from 'react';
import { Briefcase, User, Mail, Phone, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDateShort } from '../utils/dateUtils';
import { getApplicantName, getApplicantEmail, getApplicantPhone, getResumePath } from '../utils/applicationUtils';
import StatusBadge from './StatusBadge';
import ResumeActions from './ResumeActions';

const ApplicationCard = ({ 
  application, 
  onUpdateStatus, 
  onDelete,
  onViewResume,
  onPreviewResume,
  onDownloadResume
}) => {
  const applicantName = getApplicantName(application);
  const applicantEmail = getApplicantEmail(application);
  const applicantPhone = getApplicantPhone(application);
  const resumePath = getResumePath(application);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Job Info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Briefcase size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-base mb-1">{application.job?.title || 'N/A'}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1.5">
              <span className="text-gray-400">•</span>
              <span>{application.job?.spa?.name || 'N/A'}</span>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>

        {/* Applicant Info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <User size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-2">{applicantName}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{applicantEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Phone size={14} className="text-gray-400" />
              <span>{applicantPhone}</span>
            </div>
          </div>
        </div>

        {/* Resume & Date */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <ResumeActions
              resumePath={resumePath}
              candidateName={applicantName}
              onView={onViewResume}
              onPreview={onPreviewResume}
              onDownload={onDownloadResume}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
            <Calendar size={14} className="text-indigo-500" />
            <span className="font-medium">{formatDateShort(application.appliedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onUpdateStatus && onUpdateStatus(application)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Edit3 size={16} />
            Update Status
          </button>
          <button
            onClick={() => onDelete && onDelete(application._id)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;

