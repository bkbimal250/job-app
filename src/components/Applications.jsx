import React, { useEffect, useState } from 'react';
import { 
  Search, FileText, Calendar, Download, Eye, 
  CheckCircle, XCircle, MessageSquare, User, Filter,
  Briefcase, Clock, Phone, Mail, AlertCircle, FileImage,
  ChevronDown, X, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'bg-green-100 text-green-800',
      'pending': 'bg-green-100 text-green-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'under_review': 'bg-yellow-100 text-yellow-800', 
      'interviewed': 'bg-blue-100 text-blue-800',
      'hired': 'bg-purple-100 text-purple-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new':
      case 'pending':
        return <Clock size={14} className="mr-1" />;
      case 'reviewing':
      case 'under_review':
        return <Eye size={14} className="mr-1" />;
      case 'interviewed':
        return <MessageSquare size={14} className="mr-1" />;
      case 'hired':
        return <CheckCircle size={14} className="mr-1" />;
      case 'rejected':
        return <XCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Fetch applications data
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Use the appropriate endpoint for authenticated users to view their applications
        const response = await axios.get(`${BASE_URL}/application/user/applications`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        console.log('Fetched applications:', response.data);
        
        // Check if the data is in the expected format
        if (response.data && Array.isArray(response.data)) {
          setApplications(response.data);
        } else if (response.data && Array.isArray(response.data.applications)) {
          // Handle nested data structure if necessary
          setApplications(response.data.applications);
        } else {
          console.error('Unexpected data format:', response.data);
          setApplications([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Extract unique job titles to populate the job filter dropdown
  useEffect(() => {
    if (applications.length > 0) {
      const uniqueJobs = [...new Set(applications.map(app => 
        app.job?.title || app.jobTitle || 'Unknown Job'
      ))];
      
      setJobs(uniqueJobs);
    }
  }, [applications]);

  // Filter applications based on search and filter criteria
  const filteredApplications = applications.filter(app => {
    const name = app.name || app.applicantName || '';
    const email = app.email || '';
    const jobTitle = app.job?.title || app.jobTitle || '';
    const status = app.status || '';
    const appDate = app.appliedDate || app.createdAt || '';
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    // Job filter
    const matchesJob = jobFilter === 'all' || jobTitle === jobFilter;
    
    // Date filter
    let matchesDate = true;
    if (startDate || endDate) {
      const appDateObj = new Date(appDate);
      const startDateObj = startDate ? new Date(startDate) : new Date('1900-01-01');
      const endDateObj = endDate ? new Date(endDate) : new Date();
      matchesDate = appDateObj >= startDateObj && appDateObj <= endDateObj;
    }
    
    return matchesSearch && matchesStatus && matchesJob && matchesDate;
  });

  const handleDownloadCSV = () => {
    if (filteredApplications.length === 0) {
      alert('No applications to download');
      return;
    }
    
    // Prepare CSV content
    const headers = ['Applicant Name', 'Email', 'Phone', 'Job', 'Status', 'Applied Date', 
                    'Experience', 'Qualification', 'Cover Letter'];
    
    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        app.name || app.applicantName || '',
        app.email || '',
        app.phone || '',
        `"${app.job?.title || app.jobTitle || ''}"`, // Wrap in quotes for CSV safety
        app.status || '',
        app.appliedDate || app.createdAt || '',
        app.experience || '',
        `"${app.qualification || ''}"`,
        `"${app.coverLetter || app.message || ''}"`
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = () => {
    // Download only selected applications
    const selectedData = applications.filter(app => 
      selectedApplications.includes(app._id || app.id)
    );
    
    if (selectedData.length === 0) {
      alert('Please select applications to download');
      return;
    }

    // Same CSV generation logic as above
    const headers = ['Applicant Name', 'Email', 'Phone', 'Job', 'Status', 'Applied Date', 
                    'Experience', 'Qualification', 'Cover Letter'];
    
    const csvContent = [
      headers.join(','),
      ...selectedData.map(app => [
        app.name || app.applicantName || '',
        app.email || '',
        app.phone || '',
        `"${app.job?.title || app.jobTitle || ''}"`,
        app.status || '',
        app.appliedDate || app.createdAt || '',
        app.experience || '',
        `"${app.qualification || ''}"`,
        `"${app.coverLetter || app.message || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app._id || app.id));
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
            <p className="text-gray-500 mt-1">
              Track and manage all your job applications
            </p>
          </div>
          <div className="flex gap-3">
            {selectedApplications.length > 0 && (
              <button 
                onClick={handleBulkDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-sm"
              >
                <Download size={18} />
                Download Selected ({selectedApplications.length})
              </button>
            )}
            <button 
              onClick={handleDownloadCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
            >
              <Download size={18} />
              Export All
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Filter size={18} />
              <h2 className="font-medium">Filter Applications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email or job..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="text-gray-400" size={18} />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="under_review">Under Review</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="text-gray-400" size={18} />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition appearance-none bg-white"
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((job, index) => (
                    <option key={index} value={job}>{job}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start date"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <RefreshCw className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
              <p className="text-gray-500 text-lg">Loading your applications...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-gray-700 text-lg mb-2">Failed to load applications</p>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700 text-lg mb-2">No applications found</p>
              <p className="text-gray-500">
                {applications.length > 0 
                  ? "Try adjusting your search filters to find what you're looking for."
                  : "You haven't applied to any jobs yet. Start exploring opportunities!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 px-6 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id || application.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedApplications.includes(application._id || application.id)}
                          onChange={() => toggleSelectApplication(application._id || application.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{application.job?.title || application.jobTitle || 'Unknown Position'}</span>
                          <span className="text-sm text-gray-500">{application.job?.spa?.name || application.spaName || 'Unknown Company'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {formatDate(application.appliedDate || application.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status?.charAt(0).toUpperCase() + application.status?.slice(1).replace('_', ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition" 
                            title="View Details"
                            onClick={() => viewApplicationDetails(application)}
                          >
                            <Eye size={16} />
                          </button>
                          {application.resume && (
                            <a 
                              href={application.resume} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition" 
                              title="View Resume"
                            >
                              <FileText size={16} />
                            </a>
                          )}
                          <button 
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded transition" 
                            title="Download"
                            onClick={() => {
                              toggleSelectApplication(application._id || application.id);
                              handleBulkDownload();
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Job Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                  Job Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium">{selectedApplication.job?.title || selectedApplication.jobTitle || 'Unknown Position'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Spa/Company</p>
                      <p className="font-medium">{selectedApplication.job?.spa?.name || selectedApplication.spaName || 'Unknown Company'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">{formatDate(selectedApplication.appliedDate || selectedApplication.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status?.charAt(0).toUpperCase() + selectedApplication.status?.slice(1).replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-500" />
                  Your Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedApplication.name || selectedApplication.applicantName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="font-medium">{selectedApplication.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="font-medium">{selectedApplication.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{selectedApplication.experience || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter / Message */}
              {(selectedApplication.coverLetter || selectedApplication.message) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-amber-500" />
                    Cover Letter
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line text-gray-700">
                      {selectedApplication.coverLetter || selectedApplication.message}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Resume Link */}
              {selectedApplication.resume && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileImage className="mr-2 h-5 w-5 text-purple-500" />
                    Resume
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <a 
                      href={selectedApplication.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      View Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;