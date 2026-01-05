// Applications List Page
import React, { useState } from 'react';
import { Briefcase, AlertCircle, XCircle } from 'lucide-react';
import applicationService from '../../api/services/application.service';
import { ConfirmDialog, EmptyState, ErrorMessage } from '../../components/common';
import { useApplications } from './hooks/useApplications';
import { useApplicationFilters } from './hooks/useApplicationFilters';
import { getResumeUrl, downloadResume } from './utils/resumeUtils';
import {
  ApplicationHeader,
  ApplicationFilters,
  ApplicationTable,
  ApplicationCardList,
  StatusUpdateModal,
  ResumePreviewModal,
  Pagination
} from './components';

const ApplicationsListPage = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Fetch applications
  const { applications, loading, error, totalPages, totalItems, setApplications, setError } = useApplications({
    page,
    itemsPerPage,
  });

  // Filter applications
  const {
    jobFilter,
    statusFilter,
    setJobFilter,
    setStatusFilter,
    filteredApplications,
  } = useApplicationFilters(applications);

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Deletion state
  const [deletingApplication, setDeletingApplication] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Resume preview state
  const [resumePreview, setResumePreview] = useState(null);

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle status update by admin
  const handleUpdateStatus = async (applicationId, newStatus) => {
    if (!applicationId) {
      setError("Cannot update status: Application ID is missing");
      return;
    }

    setUpdatingStatus(true);

    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);

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
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'An error occurred while updating application status';
      setError(errorMessage);
      console.error('Error updating application status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle application deletion
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmationId) return;

    setDeletingApplication(true);

    try {
      await applicationService.deleteApplication(deleteConfirmationId);

      // Remove the deleted application from our local state
      setApplications(prevApplications => {
        if (!prevApplications) return [];

        return prevApplications.filter(app =>
          app && app._id !== deleteConfirmationId
        );
      });

      // Clear delete confirmation
      setDeleteConfirmationId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'An error occurred while deleting application';
      setError(errorMessage);
      console.error('Error deleting application:', err);
      setDeleteConfirmationId(null);
    } finally {
      setDeletingApplication(false);
    }
  };

  // Resume handlers
  const handleViewResume = (resumePath) => {
    if (!resumePath) {
      setError("No resume file available");
      return;
    }
    const resumeUrl = getResumeUrl(resumePath);
    window.open(resumeUrl, '_blank');
  };

  const handlePreviewResume = (resumePath) => {
    if (!resumePath) {
      setError("No resume file available");
      return;
    }
    const resumeUrl = getResumeUrl(resumePath);
    setResumePreview(resumeUrl);
  };

  const handleDownloadResume = async (resumePath, candidateName = 'Applicant') => {
    try {
      await downloadResume(resumePath, candidateName);
    } catch (err) {
      setError(err.message || "Failed to download resume");
    }
  };

  // Render loading state
  if (loading && !applications.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="text-indigo-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading applications...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !applications.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <ApplicationHeader 
          applications={filteredApplications} 
          filteredCount={filteredApplications.length} 
        />

        {/* Filter Section */}
        <ApplicationFilters
          jobFilter={jobFilter}
          statusFilter={statusFilter}
          onJobFilterChange={setJobFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Applications Found"
            message="No applications match your filter criteria. Try adjusting your filters."
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <ApplicationTable
              applications={filteredApplications}
              onUpdateStatus={(app) => setSelectedApplication(app)}
              onDelete={(id) => setDeleteConfirmationId(id)}
              onViewResume={handleViewResume}
              onPreviewResume={handlePreviewResume}
              onDownloadResume={handleDownloadResume}
            />

            {/* Mobile Card View */}
            <ApplicationCardList
              applications={filteredApplications}
              onUpdateStatus={(app) => setSelectedApplication(app)}
              onDelete={(id) => setDeleteConfirmationId(id)}
              onViewResume={handleViewResume}
              onPreviewResume={handlePreviewResume}
              onDownloadResume={handleDownloadResume}
            />
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
          updatingStatus={updatingStatus}
        />

        {/* Resume Preview Modal */}
        <ResumePreviewModal
          resumeUrl={resumePreview}
          isOpen={!!resumePreview}
          onClose={() => setResumePreview(null)}
        />

        {/* Error notification */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg max-w-md z-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteConfirmationId}
          onClose={() => setDeleteConfirmationId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Application"
          message="Are you sure you want to delete this application? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deletingApplication}
        />
      </div>
    </div>
  );
};

export default ApplicationsListPage;
