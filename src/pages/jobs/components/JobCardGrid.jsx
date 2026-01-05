// Job Card Grid Component
import React from 'react';
import JobCard from './JobCard';

const JobCardGrid = ({ 
  jobs, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard
          key={job._id || index}
          job={job}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobCardGrid;

