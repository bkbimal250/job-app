// Recent Activity Component
import React from 'react';
import { Calendar } from 'lucide-react';

const RecentActivity = ({ loading, activity, error }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Calendar size={16} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : activity ? (
          <div className="p-6 space-y-6">
            {Object.entries({
              'Recent Jobs': activity.recentJobs,
              'Recent Applications': activity.recentApplications,
              'Recent Messages': activity.recentMessages,
              'Recent Registrations': activity.recentRegistrations,
              'Recent Logins': activity.recentLogins,
            }).map(([section, items]) => (
              <div key={section}>
                <h3 className="font-semibold text-gray-700 mb-2">{section}</h3>
                {items && items.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <li key={item._id || item.timestamp || idx} className="py-2 text-sm text-gray-700">
                        {section === 'Recent Jobs' && (
                          <span>Job: <b>{item.title}</b> ({item.city || item.location || 'N/A'})</span>
                        )}
                        {section === 'Recent Applications' && (
                          <span>Application for <b>{item.job?.title || 'Job'}</b> by <b>{item.candidate?.firstname || 'User'}</b></span>
                        )}
                        {section === 'Recent Messages' && (
                          <span>Message from <b>{item.name || item.email}</b>: {item.subject}</span>
                        )}
                        {section === 'Recent Registrations' && (
                          <span>New user: <b>{item.firstname} {item.lastname}</b> ({item.email})</span>
                        )}
                        {section === 'Recent Logins' && (
                          <span>User <b>{item.user?.firstname || 'User'}</b> logged in at {new Date(item.timestamp).toLocaleString()}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-xs">No recent {section.toLowerCase()}.</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No recent activity found.</div>
        )}
      </div>
    </section>
  );
};

export default RecentActivity;

