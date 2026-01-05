// Reusable Section Header Component
import React from "react";

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  description = "",
  action = null,
  className = "" 
}) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div className="flex items-center space-x-3">
      {Icon && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-white" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default SectionHeader;

