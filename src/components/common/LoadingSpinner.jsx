// Reusable Loading Spinner Component
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = '', text = 'Loading...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader size={size} className="animate-spin text-blue-500" />
      {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

