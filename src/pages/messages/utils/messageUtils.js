// Message Utility Functions

/**
 * Format message data from API response
 * @param {Object} msg - Message object from API
 * @returns {Object} Formatted message object
 */
export const formatMessage = (msg) => {
  const createdAt = msg.createdAt ? new Date(msg.createdAt) : new Date();
  
  return {
    id: msg._id,
    sender: msg.name || 'Unknown',
    senderEmail: msg.email || '',
    subject: msg.subject || '',
    snippet: msg.message 
      ? (msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : ''))
      : '',
    fullMessage: msg.message || '',
    date: createdAt.toLocaleDateString(),
    time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: msg.status || 'unread',
    important: msg.subject === 'jobs' || msg.subject === 'employer',
    location: msg.location || '',
    phone: msg.phone || '',
    replyMessage: msg.replyMessage || '',
    repliedBy: msg.repliedBy || null,
    repliedAt: msg.repliedAt ? new Date(msg.repliedAt).toLocaleString() : '',
    createdAt: msg.createdAt,
  };
};

/**
 * Filter messages by search term
 * @param {Array} messages - Array of messages
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered messages
 */
export const filterMessages = (messages, searchTerm) => {
  if (!Array.isArray(messages) || !searchTerm) return messages;
  
  const term = searchTerm.toLowerCase();
  return messages.filter(msg =>
    msg.sender?.toLowerCase().includes(term) ||
    msg.senderEmail?.toLowerCase().includes(term) ||
    msg.subject?.toLowerCase().includes(term) ||
    msg.snippet?.toLowerCase().includes(term) ||
    msg.fullMessage?.toLowerCase().includes(term)
  );
};

/**
 * Filter messages by date range
 * @param {Array} messages - Array of messages
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Filtered messages
 */
export const filterMessagesByDate = (messages, startDate, endDate) => {
  if (!Array.isArray(messages)) return [];
  if (!startDate && !endDate) return messages;
  
  return messages.filter(msg => {
    if (!msg.createdAt) return false;
    
    const msgDate = new Date(msg.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && msgDate < start) return false;
    if (end && msgDate > end) return false;
    
    return true;
  });
};

