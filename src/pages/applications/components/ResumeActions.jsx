// Resume Actions Component
import React from 'react';
import { FileText, Download, Eye, ExternalLink, AlertTriangle } from 'lucide-react';
import { getFileType, getResumeUrl } from '../utils/resumeUtils';

const ResumeActions = ({ 
  resumePath, 
  candidateName,
  onView, 
  onPreview, 
  onDownload 
}) => {
  if (!resumePath) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
        <AlertTriangle size={14} />
        No Resume
      </span>
    );
  }

  const fileType = getFileType(resumePath);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
        <FileText size={12} />
        {fileType.toUpperCase()}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onView && onView(resumePath)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Open in new tab"
        >
          <ExternalLink size={16} />
        </button>
        {['pdf', 'image'].includes(fileType) && (
          <button
            onClick={() => onPreview && onPreview(resumePath)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Preview"
          >
            <Eye size={16} />
          </button>
        )}
        <button
          onClick={() => onDownload && onDownload(resumePath, candidateName)}
          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Download"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default ResumeActions;

