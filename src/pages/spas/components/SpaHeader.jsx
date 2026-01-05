// Spa Header Component
import React from 'react';
import { Building2, Plus } from 'lucide-react';

const SpaHeader = ({ spaCount, onAddSpa }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Spa Management</h1>
            <p className="text-indigo-100 text-sm font-medium">
              {spaCount} {spaCount === 1 ? 'spa' : 'spas'} in the system
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddSpa}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus size={20} />
          Add New Spa
        </button>
      </div>
    </div>
  );
};

export default SpaHeader;

