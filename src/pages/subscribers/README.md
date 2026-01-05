# Subscribers Page Structure

This directory contains the Subscribers Management page, organized into modular, reusable components and utilities.

## File Structure

```
subscribers/
├── components/              # React components
│   ├── SubscriberHeader.jsx      # Page header with stats
│   ├── SubscriberList.jsx        # Subscribers list with search and selection
│   ├── EmailForm.jsx             # Email sending form with job selection
│   └── index.js                  # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useSubscribers.js         # Hook for fetching subscribers
│   ├── useJobs.js                # Hook for fetching jobs (for email sending)
│   └── index.js                  # Hook exports
│
├── utils/                   # Utility functions
│   ├── subscriberUtils.js        # Subscriber data utilities
│   ├── jobUtils.js               # Job utilities for email sending
│   └── index.js                  # Utility exports
│
├── constants.js             # Constants
├── SubscribersListPage.jsx  # Main subscribers page
├── index.js                 # Page exports
└── README.md                # This file
```

## Components

### SubscriberHeader
- Displays page title and navigation back button
- Shows total subscribers count
- Shows selected subscribers count
- Gradient background design (blue → indigo → purple)

### SubscriberList
- Displays list of subscribers with search
- Checkbox selection for each subscriber
- "Select All" functionality
- Copy email functionality
- Empty state and error handling
- Responsive card layout

### EmailForm
- Manual email input with validation
- Selected recipients display
- Job search and selection
- "Select All Jobs" functionality
- Email subject and message inputs
- Jobs preview
- Success/error messages
- Send email functionality

## Hooks

### useSubscribers
- Fetches subscribers from API
- Handles loading and error states
- Sorts subscribers by date (newest first)
- Provides refetch function

### useJobs
- Fetches jobs from API (for email sending)
- Handles loading and error states
- Used for selecting jobs to send in emails

## Utils

### subscriberUtils
- `formatSubscriberDate()` - Format date for display
- `sortSubscribersByDate()` - Sort subscribers by date (newest first)
- `filterSubscribers()` - Filter subscribers by search term
- `isValidEmail()` - Validate email format

### jobUtils
- `getCategoryDisplayName()` - Get category display name
- `getJobLocation()` - Get job location string
- `filterJobs()` - Filter jobs by search term

## Constants

- `ITEMS_PER_PAGE` - Number of items per page (15)
- `PREFERRED_CHANNELS` - Preferred communication channels

## Features

- **Subscriber Management**: View all subscribers with search
- **Email Selection**: Select subscribers to send emails to
- **Manual Email**: Add email addresses manually
- **Job Selection**: Select jobs to include in email
- **Job Search**: Search jobs by title, category, or location
- **Email Sending**: Send job notifications to selected subscribers
- **Email Preview**: Preview selected jobs before sending
- **Copy Email**: Copy subscriber email addresses
- **Responsive**: Two-column layout (subscribers list + email form)
- **Sorting**: Subscribers sorted by date (newest first)
- **Validation**: Email format validation

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/hook can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

