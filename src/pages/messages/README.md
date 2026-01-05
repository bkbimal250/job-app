# Messages Page Structure

This directory contains the Messages Management page, organized into modular, reusable components and utilities.

## File Structure

```
messages/
├── components/              # React components
│   ├── MessageHeader.jsx        # Page header with title and stats
│   ├── MessageFilters.jsx       # Filter section (search, date range)
│   ├── MessageTable.jsx         # Desktop table view
│   ├── MessageCardList.jsx      # Mobile card view
│   ├── MessageRow.jsx           # Single table row (desktop)
│   ├── MessageCard.jsx          # Single card (mobile)
│   ├── ReplyModal.jsx           # Modal for replying to messages
│   ├── Pagination.jsx           # Pagination controls
│   └── index.js                 # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useMessages.js           # Hook for fetching messages
│   ├── useMessageFilters.js    # Hook for filtering logic
│   └── index.js                 # Hook exports
│
├── utils/                   # Utility functions
│   ├── dateUtils.js             # Date formatting and sorting
│   ├── messageUtils.js          # Message data formatting and filtering
│   └── index.js                 # Utility exports
│
├── constants.js             # Constants (status, items per page, etc.)
├── MessagesListPage.jsx     # Main page component
├── index.js                 # Page export
└── README.md               # This file
```

## Components

### MessageHeader
- Displays page title and total message count
- Gradient background with modern design

### MessageFilters
- Search input for filtering messages
- Date range filters (start date, end date)
- Clear filters button when filters are active

### MessageTable / MessageCardList
- Desktop: Table view with MessageRow
- Mobile: Card view with MessageCard
- Both handle the same actions (reply, delete)

### MessageRow / MessageCard
- Displays sender information (name, email, phone, location)
- Shows message preview/snippet
- Displays reply status
- Action buttons (Reply, Delete)

### ReplyModal
- Modal for replying to messages
- Shows original message
- Shows existing reply if any
- Form for entering/updating reply

### Pagination
- Previous/Next buttons
- Page indicator
- Items range display

## Hooks

### useMessages
- Fetches messages from API
- Handles loading and error states
- Manages pagination
- Supports date range filtering
- Provides refetch function

### useMessageFilters
- Filters messages by search term
- Filters messages by date range
- Returns filtered messages

## Utils

### dateUtils
- `formatMessageDate()` - Format date for display (returns date, time, full)
- `sortMessagesByDate()` - Sort by date (newest first)

### messageUtils
- `formatMessage()` - Format message data from API response
- `filterMessages()` - Filter messages by search term
- `filterMessagesByDate()` - Filter messages by date range

## Constants

- `MESSAGE_STATUS` - Status enum (read, unread)
- `ITEMS_PER_PAGE` - Number of messages per page (15)

## Usage

The main `MessagesListPage` component:
1. Uses `useMessages` hook to fetch data
2. Uses `useMessageFilters` hook to filter data
3. Renders components in a clean, organized layout
4. Handles all user interactions (reply, delete)

## Features

- **Search**: Filter messages by sender, email, subject, or message content
- **Date Range Filter**: Filter messages by date range
- **Reply**: Reply to messages with admin information
- **Delete**: Delete messages with confirmation
- **Pagination**: Navigate through pages of messages
- **Responsive**: Desktop table view and mobile card view
- **Latest First**: Messages are sorted by date (newest first)

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/utility can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

