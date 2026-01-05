// Subscriber Header Component
import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriberHeader = ({ subscriberCount, selectedCount }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <Mail size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Subscribers Management</h1>
            <p className="text-blue-100 text-sm font-medium">
              Manage subscribers and send job notifications
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="text-2xl font-bold text-white">{subscriberCount}</div>
            <div className="text-xs text-blue-100">Total Subscribers</div>
          </div>
          <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="text-2xl font-bold text-white">{selectedCount}</div>
            <div className="text-xs text-blue-100">Selected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberHeader;

