// Application Table Component (Desktop View)
import React from 'react';
import ApplicationRow from './ApplicationRow';

const ApplicationTable = ({ 
  applications, 
  onUpdateStatus, 
  onDelete,
  onViewResume,
  onPreviewResume,
  onDownloadResume
}) => {
  return (
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Job Information
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              Resume
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              Applied At
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {applications.map((application, index) => (
            <ApplicationRow
              key={application._id}
              application={application}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              onViewResume={onViewResume}
              onPreviewResume={onPreviewResume}
              onDownloadResume={onDownloadResume}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;

