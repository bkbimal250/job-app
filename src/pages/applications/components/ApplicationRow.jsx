// Application Table Row Component (Desktop)
import React from 'react';
import { Briefcase, User, Mail, Phone, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { getApplicantName, getApplicantEmail, getApplicantPhone, getResumePath } from '../utils/applicationUtils';
import StatusBadge from './StatusBadge';
import ResumeActions from './ResumeActions';

const ApplicationRow = ({ 
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
    <tr className="hover:bg-indigo-50/50 transition-all duration-200 border-b border-gray-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Briefcase size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 mb-1">{application.job?.title || 'N/A'}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1.5">
              <span className="text-gray-400">•</span>
              <span>{application.job?.spa?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <User size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate mb-1">{applicantName}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-0.5">
              <Mail size={13} className="text-gray-400" />
              <span className="truncate">{applicantEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={13} className="text-gray-400" />
              <span>{applicantPhone}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 text-center">
        <ResumeActions
          resumePath={resumePath}
          candidateName={applicantName}
          onView={onViewResume}
          onPreview={onPreviewResume}
          onDownload={onDownloadResume}
        />
      </td>

      <td className="px-6 py-5 text-center">
        <StatusBadge status={application.status} />
      </td>

      <td className="px-6 py-5 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Calendar size={14} className="text-gray-400" />
          <span className="font-medium">{formatDate(application.appliedAt)}</span>
        </div>
      </td>

      <td className="px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onUpdateStatus && onUpdateStatus(application)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Edit3 size={14} />
            Update
          </button>
          <button
            onClick={() => onDelete && onDelete(application._id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;

