import React from "react";

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-4">
    <Icon size={20} className="text-gray-700 mr-2" />
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

export default SectionHeader; 