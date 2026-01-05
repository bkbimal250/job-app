// Spa Card List Component (Mobile View)
import React from 'react';
import SpaCard from './SpaCard';

const SpaCardList = ({ 
  spas, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {spas.map((spa, index) => (
        <SpaCard
          key={spa._id || index}
          spa={spa}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SpaCardList;

