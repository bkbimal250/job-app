// Spa Card Component (Mobile)
import React from 'react';
import { MapPin, Globe, Phone, Edit, Trash2 } from 'lucide-react';
import { getSpaLocation, formatWebsite } from '../utils/spaUtils';

const SpaCard = ({ 
  spa, 
  onEdit, 
  onDelete 
}) => {
  const location = getSpaLocation(spa);
  const website = formatWebsite(spa.website);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Spa Name */}
        <div className="pb-4 border-b border-gray-100">
          <div className="font-bold text-indigo-900 text-lg">{spa.name || 'N/A'}</div>
        </div>

        {/* Location Info */}
        <div className="space-y-2 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <MapPin size={16} className="text-gray-400" />
            <span><strong>State:</strong> {spa.address?.state || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <MapPin size={16} className="text-gray-400" />
            <span><strong>City:</strong> {spa.address?.city || 'N/A'}</span>
          </div>
          {website && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
              <Globe size={16} />
              <a 
                href={spa.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                {website}
              </a>
            </div>
          )}
          {spa.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              <Phone size={16} className="text-gray-400" />
              <span>{spa.phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onEdit && onEdit(spa)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(spa)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaCard;

