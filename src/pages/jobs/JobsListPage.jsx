// Jobs List Page
import React, { useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jobService from '../../api/services/job.service';
import { ConfirmDialog, ErrorMessage, EmptyState } from '../../components/common';
import { useJobs } from './hooks/useJobs';
import { useJobFilters } from './hooks/useJobFilters';
import { usePagination } from './hooks';
import { ITEMS_PER_PAGE } from './constants';
import {
  JobHeader,
  JobFilters,
  JobCardGrid,
  Pagination,
} from './components';

const JobsListPage = () => {
  const navigate = useNavigate();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [spaFilter, setSpaFilter] = useState('all');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch jobs
  const { 
    jobs, 
    loading, 
    error, 
    setJobs, 
    setError
  } = useJobs();

  // Filter jobs
  const { filteredJobs } = useJobFilters(jobs, searchTerm, categoryFilter, locationFilter, spaFilter);

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems,
    indexOfFirstItem,
    indexOfLastItem,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredJobs, ITEMS_PER_PAGE);

  // Handle add job
  const handleAddJob = () => {
    navigate('/add-spa-job');
  };

  // Handle edit job
  const handleEditJob = (job) => {
    navigate(`/job/${job._id}`);
  };

  // Handle view job
  const handleViewJob = (job) => {
    navigate(`/view-job/${job._id}`);
  };

  // Handle delete job
  const handleDeleteClick = (job) => {
    setDeleteConfirm(job);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    setError(null);

    try {
      await jobService.deleteJob(deleteConfirm._id);
      setJobs(jobs.filter(j => j._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Failed to delete job. Please try again.';
      setError(errorMsg);
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Render loading state
  if (loading && !jobs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="text-blue-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading jobs...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <JobHeader 
          jobCount={jobs.length} 
          onAddJob={handleAddJob} 
        />

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {/* Filter Section */}
        <JobFilters
          jobs={jobs}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          locationFilter={locationFilter}
          spaFilter={spaFilter}
          onSearchChange={setSearchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onLocationFilterChange={setLocationFilter}
          onSpaFilterChange={setSpaFilter}
        />

        {/* Jobs List */}
        {currentItems.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Jobs Found"
            message="Try adjusting your search criteria or add a new job."
          />
        ) : (
          <JobCardGrid
            jobs={currentItems}
            onView={handleViewJob}
            onEdit={handleEditJob}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          onPageChange={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Job"
          message={`Are you sure you want to delete "${deleteConfirm?.title}" position? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default JobsListPage;
