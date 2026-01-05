// Users List Page
import React, { useState } from 'react';
import { Users, CheckCircle, RefreshCw } from 'lucide-react';
import userService from '../../api/services/user.service';
import { ConfirmDialog, ErrorMessage, EmptyState } from '../../components/common';
import { useUsers } from './hooks/useUsers';
import { useUserFilters } from './hooks/useUserFilters';
import {
  UserHeader,
  UserFilters,
  UserTable,
  UserCardList,
  AddUserModal,
} from './components';

const UsersListPage = () => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users
  const { 
    users, 
    loading, 
    error, 
    setUsers, 
    setError,
    refetch
  } = useUsers();

  // Filter users
  const { filteredUsers } = useUserFilters(users, searchTerm, roleFilter);

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle add user
  const handleAddUser = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await userService.registerUser(formData);
      setShowAddUserModal(false);
      setSuccessMessage('User has been created successfully!');
      refetch();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to create user. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!userToDelete || !userToDelete._id) {
      closeDeleteModal();
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await userService.deleteUser(userToDelete._id);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setSuccessMessage(`User ${userToDelete.fullName || userToDelete.email} has been deleted successfully!`);
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      'Failed to delete user. Please try again.';
      setError(errorMsg);
      setIsDeleting(false);
    }
  };

  // Render loading state
  if (loading && !users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="text-blue-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading users...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <UserHeader 
          userCount={users.length} 
          onAddUser={() => setShowAddUserModal(true)} 
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
        <UserFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
        />

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            message="Try adjusting your search criteria or add a new user."
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <UserTable
              users={filteredUsers}
              onDelete={openDeleteModal}
            />

            {/* Mobile Card View */}
            <UserCardList
              users={filteredUsers}
              onDelete={openDeleteModal}
            />
          </div>
        )}

        {/* Count Display */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-bold text-blue-600">{filteredUsers.length}</span> of{' '}
              <span className="font-bold text-gray-900">{users.length}</span> users
            </div>
          </div>
        )}

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleAddUser}
          loading={isSubmitting}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Delete User"
          message={`Are you sure you want to delete the user ${userToDelete?.fullName || userToDelete?.email}? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default UsersListPage;
