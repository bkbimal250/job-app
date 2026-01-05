// Status Update Modal Component
import React from 'react';
import { XCircle } from 'lucide-react';
import { APPLICATION_STATUSES } from '../constants';
import { getStatusConfig, getStatusButtonConfig } from '../utils/statusUtils';
import { getApplicantName } from '../utils/applicationUtils';
import StatusBadge from './StatusBadge';

const StatusUpdateModal = ({ 
  application, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  updatingStatus 
}) => {
  if (!isOpen || !application) return null;

  const applicantName = getApplicantName(application);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Update Application Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Applicant:</span>
              <p className="text-gray-900 font-medium">{applicantName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Job:</span>
              <p className="text-gray-900">{application.job?.title || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Spa:</span>
              <p className="text-gray-900">{application.job?.spa?.name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Current Status:</span>
              <div className="mt-1">
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(APPLICATION_STATUSES).map((status) => {
                const isCurrent = application.status === status;
                const config = getStatusButtonConfig(status);
                
                return (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(application._id, status)}
                    disabled={updatingStatus || isCurrent}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      isCurrent 
                        ? `${config.bg} ${config.border} ${config.text} ring-2 ring-offset-2` 
                        : `bg-white border-gray-200 text-gray-700 ${config.hover}`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;

