// Application Card List Component (Mobile View)
import React from 'react';
import ApplicationCard from './ApplicationCard';

const ApplicationCardList = ({ 
  applications, 
  onUpdateStatus, 
  onDelete,
  onViewResume,
  onPreviewResume,
  onDownloadResume
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id}
          application={application}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onViewResume={onViewResume}
          onPreviewResume={onPreviewResume}
          onDownloadResume={onDownloadResume}
        />
      ))}
    </div>
  );
};

export default ApplicationCardList;

