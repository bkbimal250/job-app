# Jobs Page Structure

This directory contains the Jobs Management pages, organized into modular, reusable components and utilities.

## File Structure

```
jobs/
├── components/              # React components
│   ├── JobHeader.jsx             # Page header with title and add button
│   ├── JobFilters.jsx           # Filter section (search, category, location, spa)
│   ├── JobCard.jsx               # Single job card component
│   ├── JobCardGrid.jsx           # Grid layout for job cards
│   ├── Pagination.jsx            # Pagination controls
│   └── index.js                  # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useJobs.js               # Hook for fetching jobs
│   ├── useJobFilters.js        # Hook for filtering logic
│   └── index.js                 # Hook exports (reuses usePagination from spas)
│
├── utils/                   # Utility functions
│   ├── jobUtils.js              # Job data utilities (category, location, salary, filtering)
│   └── index.js                 # Utility exports
│
├── constants.js             # Constants (items per page)
├── JobsListPage.jsx        # Main jobs list page
├── AddJobPage.jsx          # Add new job page
├── EditJobPage.jsx         # Edit job page
├── JobViewPage.jsx         # View job details page
├── index.js                 # Page exports
└── README.md               # This file
```

## Components

### JobHeader
- Displays page title and total job count
- Add new job button
- Gradient background design (blue → indigo → purple)

### JobFilters
- Search input for filtering jobs
- Category filter dropdown
- Location filter dropdown
- Spa filter dropdown
- Clear filters button when filters are active

### JobCard
- Displays job information (title, spa, category, location, salary, applications)
- Action buttons (View, Edit, Delete)
- "NEW" badge for new jobs
- Hover effects

### JobCardGrid
- Responsive grid layout (1-3 columns)
- Renders multiple JobCard components

### Pagination
- Previous/Next buttons
- Page number buttons (shows up to 5 pages)
- Items range display
- Responsive layout

## Hooks

### useJobs
- Fetches jobs from API
- Handles loading and error states
- Provides refetch function
- Handles different response structures

### useJobFilters
- Filters jobs by search term
- Filters jobs by category, location, and spa
- Returns filtered jobs

### usePagination
- Reused from spas hooks
- Handles pagination logic
- Calculates current page items
- Provides navigation methods

## Utils

### jobUtils
- `getCategoryDisplayName()` - Get category display name (handles string/object)
- `getJobLocation()` - Get job location string (location, state)
- `formatSalary()` - Format salary for display
- `formatDate()` - Format date for display
- `filterJobs()` - Filter jobs by search term and filters
- `getFilterOptions()` - Get unique filter options from jobs

## Constants

- `ITEMS_PER_PAGE` - Number of jobs per page (15)

## Pages

### JobsListPage
- Main page for listing and managing jobs
- Add, edit, view, delete jobs
- Search and filter functionality
- Pagination support (15 per page)
- Responsive card grid layout

### AddJobPage
- Form for adding new jobs
- Job details, spa selection, category, etc.
- Form validation

### EditJobPage
- Form for editing existing jobs
- Pre-populated with job data
- Form validation

### JobViewPage
- View job details
- Display all job information
- Edit and delete actions

## Features

- **Search**: Filter jobs by title or spa name
- **Category Filter**: Filter jobs by category
- **Location Filter**: Filter jobs by state/location
- **Spa Filter**: Filter jobs by spa
- **Pagination**: Navigate through pages (15 per page)
- **Add Job**: Create new jobs
- **Edit Job**: Update existing job information
- **View Job**: View detailed job information
- **Delete Job**: Delete jobs with confirmation
- **Responsive**: Card grid layout that adapts to screen size
- **Job Cards**: Beautiful card design with all job information

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/hook can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

