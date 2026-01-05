// Email Form Component
import React, { useState, useEffect } from 'react';
import { Send, Plus, Search, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { filterJobs, getCategoryDisplayName, getJobLocation } from '../utils/jobUtils';
import { isValidEmail } from '../utils/subscriberUtils';

const EmailForm = ({
  subscribers,
  jobs,
  jobsLoading,
  jobsError,
  selectedEmails,
  selectedJobIds,
  onEmailSelect,
  onJobSelect,
  onSelectAllJobs,
  onAddManualEmail,
  onSendEmail,
  sending
}) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  const filteredJobs = filterJobs(jobs, jobSearch);
  const selectedJobs = jobs.filter(j => selectedJobIds.includes(j._id));
  const allJobsSelected = filteredJobs.length > 0 && 
    selectedJobIds.length === filteredJobs.length;

  // Clear success/error messages when selections are cleared (after successful send)
  useEffect(() => {
    if (selectedEmails.length === 0 && selectedJobIds.length === 0) {
      setSendSuccess('');
      setSendError('');
    }
  }, [selectedEmails.length, selectedJobIds.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendSuccess('');
    setSendError('');
    
    try {
      await onSendEmail({
        emails: selectedEmails,
        subject: emailSubject,
        message: emailMessage,
        jobs: selectedJobs,
      });
      
      setSendSuccess('Jobs sent successfully!');
      setEmailSubject('');
      setEmailMessage('');
    } catch (err) {
      setSendError(err.response?.data?.message || 'Failed to send jobs email.');
    }
  };

  const handleAddManualEmail = () => {
    const email = manualEmail.trim();
    if (email && isValidEmail(email) && !selectedEmails.includes(email)) {
      onAddManualEmail(email);
      setManualEmail('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Send size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Send Job Notifications</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Manual Email Add */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Email Manually
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Enter email address..."
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleAddManualEmail}
              disabled={!manualEmail.trim() || !isValidEmail(manualEmail)}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Selected Emails Display */}
        {selectedEmails.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-blue-900 mb-2">
              Selected Recipients ({selectedEmails.length})
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedEmails.map((email, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-lg">
                  <span className="text-gray-700 break-all">{email}</span>
                  <button
                    type="button"
                    onClick={() => onEmailSelect({ target: { value: email } })}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Jobs</label>
          
          {/* Job Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Search jobs by title, category, or location..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
            />
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading jobs...</p>
            </div>
          ) : jobsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-center">
              <AlertCircle className="inline mr-2" size={16} />
              {jobsError}
            </div>
          ) : (
            <>
              {/* Select All Jobs */}
              <div className="flex items-center mb-3 pb-3 border-b border-gray-200">
                <input
                  type="checkbox"
                  id="selectAllJobs"
                  checked={allJobsSelected}
                  onChange={onSelectAllJobs}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="selectAllJobs" className="ml-2 text-sm font-medium text-gray-700">
                  Select All Jobs ({filteredJobs.length})
                </label>
              </div>

              {/* Jobs List */}
              <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">No jobs found</div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job._id} className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-200">
                      <input
                        type="checkbox"
                        value={job._id}
                        checked={selectedJobIds.includes(job._id)}
                        onChange={onJobSelect}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{job.title}</div>
                        <div className="text-xs text-gray-600">
                          {getCategoryDisplayName(job.category)} • {getJobLocation(job)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Email Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Enter email subject"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-gray-50 focus:bg-white min-h-[120px]"
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            placeholder="Enter your message or job details"
            required
          />
        </div>

        {/* Jobs Preview */}
        {selectedJobs.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase size={18} className="text-blue-600" />
              <span className="font-semibold text-blue-900">Jobs Preview ({selectedJobs.length})</span>
            </div>
            <div className="space-y-2">
              {selectedJobs.map(job => (
                <div key={job._id} className="flex items-center space-x-2 text-sm bg-white px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-900">{job.title}</span>
                  <span className="text-blue-700">•</span>
                  <span className="text-blue-700">{getCategoryDisplayName(job.category)}</span>
                  <span className="text-blue-700">•</span>
                  <span className="text-blue-700">{getJobLocation(job)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {sendSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center space-x-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-green-700 font-medium">{sendSuccess}</span>
          </div>
        )}
        {sendError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-2">
            <AlertCircle size={18} className="text-red-600" />
            <span className="text-red-700 font-medium">{sendError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={sending || selectedEmails.length === 0}
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Job Notifications ({selectedEmails.length} recipients)
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;

