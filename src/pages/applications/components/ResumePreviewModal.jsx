// Resume Preview Modal Component
import React from 'react';
import { XCircle, Download } from 'lucide-react';

const ResumePreviewModal = ({ resumeUrl, isOpen, onClose }) => {
  if (!isOpen || !resumeUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Resume Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe
            src={resumeUrl}
            title="Resume Preview"
            className="w-full h-full border-0"
          ></iframe>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={18} />
            Download
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;

