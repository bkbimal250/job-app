// Subscribers List Page
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import API from '../../api/config/axios';
import subscriberService from '../../api/services/subscriber.service';
import { useSubscribers } from './hooks/useSubscribers';
import { useJobs } from './hooks/useJobs';
import { filterSubscribers } from './utils/subscriberUtils';
import {
  SubscriberHeader,
  SubscriberList,
  EmailForm,
} from './components';

const SubscribersListPage = () => {
  // Search state
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Email selection state
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [sending, setSending] = useState(false);

  // Fetch subscribers
  const { 
    subscribers, 
    loading, 
    error 
  } = useSubscribers();

  // Fetch jobs
  const { 
    jobs, 
    loading: jobsLoading, 
    error: jobsError 
  } = useJobs();

  // Filter subscribers
  const filteredSubscribers = filterSubscribers(subscribers, subscriberSearch);

  // Handle email selection
  const handleEmailSelect = (e) => {
    const value = e.target.value;
    setSelectedEmails(prev =>
      prev.includes(value)
        ? prev.filter(email => email !== value)
        : [...prev, value]
    );
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const emails = filteredSubscribers
        .map(s => s.email)
        .filter(Boolean);
      setSelectedEmails(emails);
    } else {
      setSelectedEmails([]);
    }
  };

  // Handle job selection
  const handleJobSelect = (e) => {
    const value = e.target.value;
    setSelectedJobIds(prev =>
      prev.includes(value)
        ? prev.filter(id => id !== value)
        : [...prev, value]
    );
  };

  // Handle select all jobs (will be handled in EmailForm with filtered jobs)
  const handleSelectAllJobs = (e) => {
    // This will be handled by EmailForm component with filtered jobs
    // For now, just toggle all jobs
    if (e.target.checked) {
      const jobIds = jobs.map(j => j._id).filter(Boolean);
      setSelectedJobIds(jobIds);
    } else {
      setSelectedJobIds([]);
    }
  };

  // Get selected job objects
  const selectedJobs = jobs.filter(j => selectedJobIds.includes(j._id));

  // Handle send email
  const handleSendEmail = async ({ emails, subject, message, jobs: jobsArray }) => {
    setSending(true);
    try {
      const res = await API.post('/send-jobs-email', {
        emails,
        subject,
        message,
        jobs: jobsArray,
      });
      setSelectedEmails([]);
      setSelectedJobIds([]);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setSending(false);
    }
  };

  // Handle add manual email
  const handleAddManualEmail = (email) => {
    if (email && !selectedEmails.includes(email)) {
      setSelectedEmails(prev => [...prev, email]);
    }
  };

  // Handle copy email
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };

  // Render loading state
  if (loading && !subscribers.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Mail className="text-blue-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading subscribers...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <SubscriberHeader 
          subscriberCount={subscribers.length}
          selectedCount={selectedEmails.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Subscribers List */}
          <SubscriberList
            subscribers={filteredSubscribers}
            loading={loading}
            error={error}
            searchTerm={subscriberSearch}
            onSearchChange={setSubscriberSearch}
            selectedEmails={selectedEmails}
            onEmailSelect={handleEmailSelect}
            onSelectAll={handleSelectAll}
            onCopyEmail={handleCopyEmail}
          />

          {/* Right: Email Form */}
          <EmailForm
            subscribers={subscribers}
            jobs={jobs}
            jobsLoading={jobsLoading}
            jobsError={jobsError}
            selectedEmails={selectedEmails}
            selectedJobIds={selectedJobIds}
            onEmailSelect={handleEmailSelect}
            onJobSelect={handleJobSelect}
            onSelectAllJobs={handleSelectAllJobs}
            onAddManualEmail={handleAddManualEmail}
            onSendEmail={handleSendEmail}
            sending={sending}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscribersListPage;
