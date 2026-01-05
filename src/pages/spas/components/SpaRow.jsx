// Spa Table Row Component (Desktop)
import React from 'react';
import { MapPin, Globe, Phone, Edit, Trash2 } from 'lucide-react';
import { getSpaLocation, formatWebsite } from '../utils/spaUtils';

const SpaRow = ({ 
  spa, 
  onEdit, 
  onDelete 
}) => {
  const location = getSpaLocation(spa);
  const website = formatWebsite(spa.website);

  return (
    <tr className="hover:bg-indigo-50/50 transition-all duration-200 border-b border-gray-100 last:border-0">
      <td className="px-6 py-5">
        <div className="font-semibold text-indigo-900">{spa.name || 'N/A'}</div>
      </td>
      
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={16} className="text-gray-400" />
          <span>{spa.address?.state || 'N/A'}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={16} className="text-gray-400" />
          <span>{spa.address?.city || 'N/A'}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        {website ? (
          <a 
            href={spa.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            <Globe size={16} />
            <span className="truncate max-w-xs">{website}</span>
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={16} className="text-gray-400" />
          <span>{spa.phone || 'N/A'}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit && onEdit(spa)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            title="Edit Spa"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(spa)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            title="Delete Spa"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SpaRow;

