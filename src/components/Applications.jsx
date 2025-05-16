import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/getToken';
import { CSVLink } from 'react-csv';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import './style/application.css';

// Status options for applications
const APPLICATION_STATUSES = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired'
};

const Applications = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering state
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filtered applications
  const [filteredApplications, setFilteredApplications] = useState([]);
  
  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // CSV Headers configuration
  const csvHeaders = [
    { label: 'Job Title', key: 'job.title' },
    { label: 'Spa Name', key: 'spa.name' },
    { label: 'Full Name', key: 'candidate.fullName' },
    { label: 'Email', key: 'candidate.email' },
    { label: 'Phone', key: 'candidate.phone' },
    { label: 'Resume', key: 'resume' },
    { label: 'Cover Letter', key: 'coverLetter' },
    { label: 'Status', key: 'status' },
    { label: 'Applied At', key: 'appliedAt' },
  ];

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `${BASE_URL}/application/admin/applications`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            params: {
              page,
              limit: itemsPerPage,
            },
          }
        );

        if (response.status === 200) {
          // Initialize with an empty array if data is missing
          const applicationData = response.data.data || [];
          setApplications(applicationData);
          setTotalPages(response.data.totalPages || 1);
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching applications');
        console.error('Error fetching applications:', error);
        // Initialize with empty array on error
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page, itemsPerPage]);

  // Effect for filtering jobs based on job title and spa name
  useEffect(() => {
    if (!applications || !Array.isArray(applications)) {
      setFilteredApplications([]);
      return;
    }
    
    const filteredData = applications.filter((application) => {
      // Skip null or undefined applications
      if (!application) return false;
      
      // Check if job title matches filter
      const matchesJob =
        !jobFilter || 
        (application.job?.title?.toLowerCase().includes(jobFilter.toLowerCase()) ?? false) ||
        (application.job?.spa?.name?.toLowerCase().includes(jobFilter.toLowerCase()) ?? false);
        
      // Check if status matches filter
      const matchesStatus =
        !statusFilter || 
        (application.status?.toLowerCase() === statusFilter.toLowerCase());
        
      return matchesJob && matchesStatus;
    });

    setFilteredApplications(filteredData);
  }, [applications, jobFilter, statusFilter]);

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle status update by admin
  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (!applicationId) {
      setError("Cannot update status: Application ID is missing");
      return;
    }
    
    setUpdatingStatus(true);
    
    try {
      // Check if the new status is valid
      const response = await axios.put(
        `${BASE_URL}/application/admin/applications/status/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the application status in our local state
        setApplications(prevApplications => {
          if (!prevApplications) return [];
          
          return prevApplications.map(app => 
            app && app._id === applicationId 
              ? { ...app, status: newStatus } 
              : app
          );
        });
        
        // Clear selected application
        setSelectedApplication(null);
      } else {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while updating application status');
      console.error('Error updating application status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Open status update modal
  const openStatusUpdateModal = (application) => {
    setSelectedApplication(application);
  };

  // Close status update modal
  const closeStatusUpdateModal = () => {
    setSelectedApplication(null);
  };

  // Prepare data for CSV export
  const csvData = filteredApplications.map((application) => ({
    'job.title': application.job?.title || '',
    'spa.name': application.job?.spa?.name || '',
    'candidate.fullName': application.candidate?.fullName || 
      `${application.candidate?.firstname || ''} ${application.candidate?.lastname || ''}`.trim() || 
      application.guestInfo?.fullName || '',
    'candidate.email': application.candidate?.email || application.guestInfo?.email || '',
    'candidate.phone': application.candidate?.phone || application.guestInfo?.phone || '',
    resume: application.resume ? 'Available' : 'No Resume',
    coverLetter: application.coverLetter || 'No Cover Letter',
    status: application.status || '',
    appliedAt: new Date(application.appliedAt).toLocaleString(),
  }));

  // Add function to handle viewing resume
  const viewResume = (resumeUrl) => {
    if (!resumeUrl) return;
    
    // If the URL doesn't start with http or https, assume it's a relative path from the backend
    if (!resumeUrl.startsWith('http')) {
      window.open(`${BASE_URL}${resumeUrl}`, '_blank');
    } else {
      window.open(resumeUrl, '_blank');
    }
  };

  // Render loading state
  if (loading && !applications.length) {
    return <div className="loading-container">Loading applications...</div>;
  }

  // Render error state
  if (error && !applications.length) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>Applications Management</h1>
        
        {/* Export button */}
        <div className="export-container">
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`applications_${new Date().toISOString()}.csv`}
            className="export-button"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-item">
          <label htmlFor="job-filter">Filter by Job Title or Spa:</label>
          <input
            id="job-filter"
            type="text"
            placeholder="Enter job title or spa name..."
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-item">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value={APPLICATION_STATUSES.PENDING}>Pending</option>
            <option value={APPLICATION_STATUSES.SHORTLISTED}>Shortlisted</option>
            <option value={APPLICATION_STATUSES.REJECTED}>Rejected</option>
            <option value={APPLICATION_STATUSES.HIRED}>Hired</option>
          </select>
        </div>
      </div>

      {/* Applications table */}
      <div className="table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Spa Name</th>
              <th>Applicant Informations</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No applications found matching the filter criteria
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => {
                const applicant = application.candidate || application.guestInfo;
                return (
                  <tr key={application._id}>

                    
                    <td>
                      <strong>Spa Name:</strong>
                      
                      {application.job?.spa?.name || 'N/A'}
                      <br />
                      <strong>Job Title:</strong>
                    {application.job?.title || 'N/A'}

                    </td>
                    <td>{applicant?.fullName || `${applicant?.firstname || ''} ${applicant?.lastname || ''}`.trim() || 'N/A'} <br />{applicant?.email || 'N/A'} <br />{applicant?.phone || 'N/A'}</td>
                  
                    <td>
                      {application.resume ? (
                        <button 
                          onClick={() => viewResume(application.resume)}
                          className="view-resume-button"
                        >
                          View Resume
                        </button>
                      ) : (
                        <span className="no-resume">No Resume</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${application.status}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>{formatDate(application.appliedAt)}</td>
                    <td>
                      <button
                        onClick={() => openStatusUpdateModal(application)}
                        className="update-status-button"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button 
          onClick={() => handlePageChange(page - 1)} 
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {page} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(page + 1)} 
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {/* Status Update Modal */}
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="status-modal">
            <div className="modal-header">
              <h2>Update Application Status</h2>
              <button 
                onClick={closeStatusUpdateModal}
                className="close-button"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                <strong>Applicant:</strong> {
                  selectedApplication.candidate?.fullName || 
                  `${selectedApplication.candidate?.firstname || ''} ${selectedApplication.candidate?.lastname || ''}`.trim() || 
                  'N/A'
                }
              </p>
              <p>
                <strong>Job:</strong> {selectedApplication.job?.title || 'N/A'}
              </p>
              <p>
                <strong>Spa:</strong> {selectedApplication.job?.spa?.name || 'N/A'}
              </p>
              <p>
                <strong>Current Status:</strong> 
                <span className={`status-badge status-${selectedApplication.status}`}>
                  {selectedApplication.status}
                </span>
              </p>
              
              <div className="status-selection">
                <label htmlFor="new-status">Select New Status:</label>
                <div className="status-buttons">
                  {Object.values(APPLICATION_STATUSES).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateApplicationStatus(selectedApplication._id, status)}
                      disabled={updatingStatus || selectedApplication.status === status}
                      className={`status-button status-${status} ${selectedApplication.status === status ? 'current' : ''}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={closeStatusUpdateModal}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error notification */}
      {error && (
        <div className="error-notification">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default Applications;