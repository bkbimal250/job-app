// Spas List Page
import React, { useState } from 'react';
import { Building2, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import spaService from '../../api/services/spa.service';
import { ConfirmDialog, ErrorMessage, EmptyState } from '../../components/common';
import { useSpas } from './hooks/useSpas';
import { useSpaFilters } from './hooks/useSpaFilters';
import { usePagination } from './hooks/usePagination';
import { ITEMS_PER_PAGE } from './constants';
import {
  SpaHeader,
  SpaFilters,
  SpaTable,
  SpaCardList,
  Pagination,
} from './components';

const SpasListPage = () => {
  const navigate = useNavigate();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [phoneFilter, setPhoneFilter] = useState('');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch spas
  const { 
    spas, 
    loading, 
    error, 
    setSpas, 
    setError,
    refetch
  } = useSpas();

  // Filter spas
  const { filteredSpas } = useSpaFilters(spas, searchTerm, stateFilter, cityFilter, phoneFilter);

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
  } = usePagination(filteredSpas, ITEMS_PER_PAGE);

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle add spa
  const handleAddSpa = () => {
    navigate('addSpa');
  };

  // Handle edit spa
  const handleEditSpa = (spa) => {
    navigate(`/edit-spa/${spa._id}`);
  };

  // Handle delete spa
  const handleDeleteClick = (spa) => {
    setDeleteConfirm(spa);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    setError(null);

    try {
      await spaService.deleteSpa(deleteConfirm._id);
      setSpas(spas.filter(spa => spa._id !== deleteConfirm._id));
      setSuccessMessage(`Spa ${deleteConfirm.name} has been deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Failed to delete spa. Please try again.';
      setError(errorMsg);
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Render loading state
  if (loading && !spas.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="text-indigo-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading spas...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <SpaHeader 
          spaCount={spas.length} 
          onAddSpa={handleAddSpa} 
        />

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Success!</h3>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {/* Filter Section */}
        <SpaFilters
          spas={spas}
          searchTerm={searchTerm}
          stateFilter={stateFilter}
          cityFilter={cityFilter}
          phoneFilter={phoneFilter}
          onSearchChange={setSearchTerm}
          onStateFilterChange={setStateFilter}
          onCityFilterChange={setCityFilter}
          onPhoneFilterChange={setPhoneFilter}
        />

        {/* Spas List */}
        {currentItems.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Spas Found"
            message="Try adjusting your search criteria or add a new spa."
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <SpaTable
              spas={currentItems}
              onEdit={handleEditSpa}
              onDelete={handleDeleteClick}
            />

            {/* Mobile Card View */}
            <SpaCardList
              spas={currentItems}
              onEdit={handleEditSpa}
              onDelete={handleDeleteClick}
            />
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSpas.length}
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
          title="Delete Spa"
          message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default SpasListPage;
