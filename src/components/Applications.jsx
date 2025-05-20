import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/getToken';
import { CSVLink } from 'react-csv';
import { FileText, Download, Eye, ExternalLink, AlertTriangle } from 'lucide-react';
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
  
  // Deletion state
  const [deletingApplication, setDeletingApplication] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  
  // Resume preview state
  const [resumePreview, setResumePreview] = useState(null);

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

  // Handle application deletion
  const deleteApplication = async (applicationId) => {
    if (!applicationId) {
      setError("Cannot delete: Application ID is missing");
      return;
    }
    
    setDeletingApplication(true);
    
    try {
      const response = await axios.delete(
        `${BASE_URL}/application/user/applications/${applicationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted application from our local state
        setApplications(prevApplications => {
          if (!prevApplications) return [];
          
          return prevApplications.filter(app => 
            app && app._id !== applicationId
          );
        });
        
        // Clear delete confirmation
        setDeleteConfirmationId(null);
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while deleting application');
      console.error('Error deleting application:', error);
    } finally {
      setDeletingApplication(false);
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
  
  // Function to show delete confirmation
  const showDeleteConfirmation = (applicationId) => {
    setDeleteConfirmationId(applicationId);
  };

  // Function to hide delete confirmation
  const hideDeleteConfirmation = () => {
    setDeleteConfirmationId(null);
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

  // Get complete resume URL with better path handling
  const getResumeUrl = (resumePath) => {
    if (!resumePath) return null;
    
    console.log("Original resume path:", resumePath);
    
    // If the URL is already absolute (starts with http), use it as is
    if (resumePath.startsWith('http')) {
      console.log("Using absolute URL:", resumePath);
      return resumePath;
    }
    
    // Different path formats that might be used in the application data
    // 1. Handle paths with 'uploads/' prefix
    if (resumePath.includes('uploads/')) {
      const uploadsPath = resumePath.substring(resumePath.indexOf('uploads/'));
      console.log("Extracted uploads path:", uploadsPath);
      return `${BASE_URL}/${uploadsPath}`;
    }
    
    // 2. Handle paths without 'uploads/' prefix but that should have it
    if (!resumePath.includes('uploads/') && 
        !resumePath.includes('/') && 
        (resumePath.endsWith('.pdf') || resumePath.endsWith('.doc') || resumePath.endsWith('.docx'))) {
      console.log("Adding uploads/ prefix to filename");
      return `${BASE_URL}/uploads/${resumePath}`;
    }
    
    // 3. Standard case: Remove any leading slash to prevent double slashes
    const cleanPath = resumePath.startsWith('/') ? resumePath.substring(1) : resumePath;
    console.log("Using standard path resolution:", `${BASE_URL}/${cleanPath}`);
    return `${BASE_URL}/${cleanPath}`;
  };

  // Function to view resume in a new tab
  const viewResumeInNewTab = (resumePath) => {
    if (!resumePath) {
      setError("No resume file available");
      return;
    }
    
    const resumeUrl = getResumeUrl(resumePath);
    window.open(resumeUrl, '_blank');
  };
  
  // Function to download resume
  const downloadResume = async (resumePath, candidateName) => {
    if (!resumePath) {
      setError("No resume file available");
      return;
    }
    
    try {
      const resumeUrl = getResumeUrl(resumePath);
      
      // Create a filename based on the candidate's name and date
      const safeFileName = candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${safeFileName}_resume_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Fetch the file as a blob
      const response = await fetch(resumeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download resume: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      
      // Append, click, and remove the download link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Release the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError(error.message || "Failed to download resume");
    }
  };
  
  // Function to preview resume in modal
  const previewResume = (resumePath) => {
    if (!resumePath) {
      setError("No resume file available");
      return;
    }
    
    const resumeUrl = getResumeUrl(resumePath);
    setResumePreview(resumeUrl);
  };
  
  // Function to close resume preview
  const closeResumePreview = () => {
    setResumePreview(null);
  };
  
  // Determine file type from URL
  const getFileType = (url) => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    
    return 'unknown';
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
              <th>Job Information</th>
              <th>Applicant Information</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center', border: '2px solid #000' }}>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No applications found matching the filter criteria
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => {
                const applicant = application.candidate || application.guestInfo;
                const applicantName = applicant?.fullName || 
                  `${applicant?.firstname || ''} ${applicant?.lastname || ''}`.trim() || 
                  'Unnamed Applicant';
                const fileType = getFileType(application.resume);
                
                return (
                  <tr key={application._id} style={{ textAlign: 'center', border: '1px solid #000' }}>
                    <td>
                      <strong>Spa Name:</strong> {application.job?.spa?.name || 'N/A'}
                      <br />
                      <strong>Job Title:</strong> {application.job?.title || 'N/A'}
                    </td>
                    <td>
                      <div className="applicant-info">
                        <div><strong>{applicantName}</strong></div>
                        <div>{applicant?.email || 'N/A'}</div>
                        <div>{applicant?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      {application.resume ? (
                        <div className="resume-actions">
                          <div className="file-type-badge">
                            <FileText size={14} />
                            <span>{fileType.toUpperCase()}</span>
                          </div>
                          
                          <div className="resume-buttons">
                            {/* View button */}
                            <button 
                              onClick={() => viewResumeInNewTab(application.resume, application._id)}
                              className="resume-action-button view-button"
                              title="Open in new tab"
                            >
                              <ExternalLink size={16} />
                            </button>
                            
                            {/* Preview button - for PDFs and images only */}
                            {['pdf', 'image'].includes(fileType) && (
                              <button 
                                onClick={() => previewResume(application.resume, application._id)}
                                className="resume-action-button preview-button"
                                title="Preview"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            
                            {/* Download button */}
                            <button 
                              onClick={() => downloadResume(application.resume, applicantName, application._id)}
                              className="resume-action-button download-button"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            
                            {/* Debug button */}
                            <button 
                              onClick={() => debugResumeData(application)}
                              className="resume-action-button debug-button"
                              title="Debug Resume Path"
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                              }}
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="no-resume">
                          <AlertTriangle size={16} className="no-resume-icon" />
                          No Resume
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${application.status}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>{formatDate(application.appliedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openStatusUpdateModal(application)}
                          className="update-status-button"
                        >
                          Update Status
                        </button>
                        
                        {/* Delete Button */}
                        {deleteConfirmationId === application._id ? (
                          <div className="delete-confirmation">
                            <p>Are you sure?</p>
                            <div className="confirmation-buttons">
                              <button 
                                onClick={() => deleteApplication(application._id)}
                                className="confirm-delete-button"
                                disabled={deletingApplication}
                              >
                                {deletingApplication ? 'Deleting...' : 'Yes, Delete'}
                              </button>
                              <button 
                                onClick={hideDeleteConfirmation}
                                className="cancel-delete-button"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => showDeleteConfirmation(application._id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
                  selectedApplication.guestInfo?.fullName ||
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
      
      {/* Resume Preview Modal */}
      {resumePreview && (
        <div className="modal-overlay">
          <div className="resume-preview-modal">
            <div className="modal-header">
              <h2>Resume Preview</h2>
              <button 
                onClick={closeResumePreview}
                className="close-button"
              >
                &times;
              </button>
            </div>
            
            <div className="resume-preview-container">
              <iframe 
                src={resumePreview} 
                title="Resume Preview" 
                className="resume-preview-frame"
              ></iframe>
            </div>
            
            <div className="modal-footer">
              <a 
                href={resumePreview} 
                download 
                className="download-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={16} />
                Download
              </a>
              <button 
                onClick={closeResumePreview}
                className="cancel-button"
              >
                Close
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
      
      {/* CSS for the enhanced resume features */}
      <style jsx>{`
        .resume-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        
        .file-type-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          color: #555;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          gap: 3px;
        }
        
        .resume-buttons {
          display: flex;
          gap: 6px;
        }
        
        .resume-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .view-button {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        
        .view-button:hover {
          background-color: #bae6fd;
        }
        
        .preview-button {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
        
        .preview-button:hover {
          background-color: #c7d2fe;
        }
        
        .download-button {
          background-color: #dcfce7;
          color: #16a34a;
        }
        
        .download-button:hover {
          background-color: #bbf7d0;
        }
        
        .no-resume {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #dc2626;
          font-size: 0.85rem;
        }
        
        .no-resume-icon {
          color: #dc2626;
        }
        
        .applicant-info {
          text-align: left;
          padding: 6px;
        }
        
        .resume-preview-modal {
          background-color: white;
          border-radius: 6px;
          width: 85%;
          max-width: 900px;
          height: 80vh;
          max-height: 800px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .resume-preview-container {
          flex: 1;
          overflow: hidden;
        }
        
        .resume-preview-frame {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .modal-header {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-footer {
          padding: 16px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #e5e7eb;
        }
        
        .modal-footer .download-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          text-decoration: none;
        }
        
        /* Auth Error Styles */
        .auth-error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 24px;
        }
        
        .auth-error-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 32px;
          text-align: center;
          max-width: 450px;
          width: 100%;
        }
        
        .auth-error-icon {
          color: #ef4444;
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
        }
        
        .auth-error-card h2 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #1f2937;
        }
        
        .auth-error-card p {
          color: #4b5563;
          margin-bottom: 24px;
        }
        
        .auth-refresh-button {
          background-color: #2563eb;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0 auto;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .auth-refresh-button:hover {
          background-color: #1d4ed8;
        }
        
        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #2563eb;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Error Styles */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 24px;
        }
        
        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          max-width: 500px;
        }
        
        .error-icon {
          color: #dc2626;
          margin-bottom: 12px;
        }
        
        .error-message h3 {
          font-size: 18px;
          color: #b91c1c;
          margin-bottom: 8px;
        }
        
        .error-message p {
          color: #7f1d1d;
          margin-bottom: 16px;
        }
        
        .retry-button {
          background-color: #dc2626;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0 auto;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .retry-button:hover {
          background-color: #b91c1c;
        }
        
        /* Error notification */
        .error-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .error-notification-content {
          background-color: #fee2e2;
          border-left: 4px solid #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 400px;
        }
        
        .error-notification p {
          color: #7f1d1d;
          flex: 1;
          margin: 0;
        }
        
        .error-dismiss-button {
          background-color: transparent;
          color: #dc2626;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .error-dismiss-button:hover {
          text-decoration: underline;
        }items: center;
          gap: 6px;
          padding: 8px 16px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default Applications;