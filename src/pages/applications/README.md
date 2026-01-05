# Applications Page Structure

This directory contains the Applications Management page, organized into modular, reusable components and utilities.

## File Structure

```
applications/
├── components/              # React components
│   ├── ApplicationHeader.jsx      # Page header with title and CSV export
│   ├── ApplicationFilters.jsx     # Filter section (job title, status)
│   ├── ApplicationTable.jsx       # Desktop table view
│   ├── ApplicationCardList.jsx    # Mobile card view
│   ├── ApplicationRow.jsx         # Single table row (desktop)
│   ├── ApplicationCard.jsx        # Single card (mobile)
│   ├── StatusBadge.jsx            # Status badge component
│   ├── ResumeActions.jsx          # Resume action buttons
│   ├── StatusUpdateModal.jsx      # Modal for updating status
│   ├── ResumePreviewModal.jsx     # Modal for previewing resume
│   ├── Pagination.jsx             # Pagination controls
│   └── index.js                   # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useApplications.js         # Hook for fetching applications
│   ├── useApplicationFilters.js   # Hook for filtering logic
│   └── index.js                   # Hook exports
│
├── utils/                   # Utility functions
│   ├── dateUtils.js              # Date formatting and sorting
│   ├── resumeUtils.js            # Resume URL handling and download
│   ├── statusUtils.js            # Status badge configuration
│   ├── applicationUtils.js       # Application data helpers
│   └── index.js                  # Utility exports
│
├── constants.js             # Constants (statuses, CSV headers, etc.)
├── ApplicationsListPage.jsx # Main page component
├── index.js                 # Page export
└── README.md               # This file
```

## Components

### ApplicationHeader
- Displays page title and application count
- CSV export button

### ApplicationFilters
- Job title/spa name search filter
- Status dropdown filter

### ApplicationTable / ApplicationCardList
- Desktop: Table view with ApplicationRow
- Mobile: Card view with ApplicationCard
- Both handle the same actions (update status, delete, resume actions)

### StatusBadge
- Displays application status with color-coded badge and icon

### ResumeActions
- Shows resume file type
- Action buttons: View, Preview (PDF/images), Download

### StatusUpdateModal
- Modal for updating application status
- Shows current status and allows selection of new status

### ResumePreviewModal
- Modal with iframe for previewing resume
- Download button

### Pagination
- Previous/Next buttons
- Page indicator

## Hooks

### useApplications
- Fetches applications from API
- Handles loading and error states
- Manages pagination

### useApplicationFilters
- Filters applications by job title/spa name and status
- Returns filtered and sorted applications

## Utils

### dateUtils
- `formatDate()` - Format date for display
- `formatDateShort()` - Short date format
- `sortApplicationsByDate()` - Sort by date (newest first)

### resumeUtils
- `getResumeUrl()` - Construct resume URL
- `getFileType()` - Determine file type from URL
- `downloadResume()` - Download resume file

### statusUtils
- `getStatusConfig()` - Get status badge configuration
- `getStatusButtonConfig()` - Get status button styling
- `getAllStatuses()` - Get all available statuses

### applicationUtils
- `getApplicantName()` - Extract applicant name
- `getApplicantEmail()` - Extract applicant email
- `getApplicantPhone()` - Extract applicant phone
- `getResumePath()` - Extract resume path
- `filterApplications()` - Filter applications
- `prepareCsvData()` - Prepare data for CSV export

## Constants

- `APPLICATION_STATUSES` - Status enum (pending, shortlisted, rejected, hired)
- `CSV_HEADERS` - CSV export headers
- `RESUME_BASE_URL` - Base URL for resume files

## Usage

The main `ApplicationsListPage` component:
1. Uses `useApplications` hook to fetch data
2. Uses `useApplicationFilters` hook to filter data
3. Renders components in a clean, organized layout
4. Handles all user interactions (update status, delete, resume actions)

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/utility can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

