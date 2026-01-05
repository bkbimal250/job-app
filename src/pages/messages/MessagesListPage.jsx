// Messages List Page
import React, { useState } from 'react';
import { Mail, AlertCircle, XCircle } from 'lucide-react';
import { useAuthUser } from '../../auth/AuthContext';
import messageService from '../../api/services/message.service';
import { ConfirmDialog, EmptyState, ErrorMessage } from '../../components/common';
import { useMessages } from './hooks/useMessages';
import { useMessageFilters } from './hooks/useMessageFilters';
import { ITEMS_PER_PAGE } from './constants';
import {
  MessageHeader,
  MessageFilters,
  MessageTable,
  MessageCardList,
  ReplyModal,
  Pagination
} from './components';

const MessagesListPage = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Reply state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const user = useAuthUser();

  // Fetch messages
  const { 
    messages, 
    loading, 
    error, 
    totalPages, 
    messageCount, 
    setMessages, 
    setError,
    refetch
  } = useMessages({
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    startDate,
    endDate,
  });

  // Filter messages
  const { filteredMessages } = useMessageFilters(messages, searchTerm, startDate, endDate);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useMessageFilters hook
  };

  // Handle reply
  const handleReply = (message) => {
    setReplyingTo(message);
    setReplyError(null);
    setReplyModalOpen(true);
  };

  // Send reply
  const handleSendReply = async (replyText) => {
    if (!replyText.trim()) {
      setReplyError('Reply message cannot be empty.');
      return;
    }

    setReplyLoading(true);
    setReplyError(null);

    try {
      await messageService.replyToMessage(replyingTo.id, {
        replyMessage: replyText,
        repliedBy: {
          name: user?.name || 'Admin',
          email: user?.email || ''
        }
      });

      setReplyModalOpen(false);
      setReplyingTo(null);
      
      // Refresh messages
      refetch();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to send reply';
      setReplyError(errorMessage);
    } finally {
      setReplyLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (messageId) => {
    setDeleteConfirmId(messageId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await messageService.deleteMessage(deleteConfirmId);
      
      // Remove message from the local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== deleteConfirmId)
      );
      setDeleteConfirmId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          "Failed to delete message";
      setError(errorMessage);
      setDeleteConfirmId(null);
    }
  };

  // Render loading state
  if (loading && !messages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Mail className="text-purple-600 animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading messages...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !messages.length) {
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
        <MessageHeader messageCount={messageCount} />

        {/* Filter Section */}
        <MessageFilters
          searchTerm={searchTerm}
          startDate={startDate}
          endDate={endDate}
          onSearchChange={setSearchTerm}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
        />

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No Messages Found"
            message="No messages match your search criteria. Try adjusting your filters."
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <MessageTable
              messages={filteredMessages}
              onReply={handleReply}
              onDelete={handleDeleteClick}
            />

            {/* Mobile Card View */}
            <MessageCardList
              messages={filteredMessages}
              onReply={handleReply}
              onDelete={handleDeleteClick}
            />
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={messageCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />

        {/* Reply Modal */}
        <ReplyModal
          message={replyingTo}
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setReplyingTo(null);
            setReplyError(null);
          }}
          onSendReply={handleSendReply}
          loading={replyLoading}
          error={replyError}
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
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Message"
          message="Are you sure you want to delete this message? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default MessagesListPage;
