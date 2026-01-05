// Application Header Component
import React from 'react';
import { CSVLink } from 'react-csv';
import { Briefcase, Download, FileText } from 'lucide-react';
import { CSV_HEADERS } from '../constants';
import { prepareCsvData } from '../utils/applicationUtils';

const ApplicationHeader = ({ applications, filteredCount }) => {
  const csvData = prepareCsvData(applications);

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <Briefcase size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Applications Management</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <FileText size={16} />
              <p className="text-sm font-medium">
                {filteredCount} {filteredCount === 1 ? 'application' : 'applications'} found
              </p>
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <CSVLink
          data={csvData}
          headers={CSV_HEADERS}
          filename={`applications_${new Date().toISOString()}.csv`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Download size={18} />
          Export to CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default ApplicationHeader;

