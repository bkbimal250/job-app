# Spas Page Structure

This directory contains the Spas Management pages, organized into modular, reusable components and utilities.

## File Structure

```
spas/
├── components/              # React components
│   ├── SpaHeader.jsx            # Page header with title and add button
│   ├── SpaFilters.jsx          # Filter section (search, state, city, phone)
│   ├── SpaTable.jsx            # Desktop table view
│   ├── SpaCardList.jsx         # Mobile card view
│   ├── SpaRow.jsx              # Single table row (desktop)
│   ├── SpaCard.jsx             # Single card (mobile)
│   ├── Pagination.jsx          # Pagination controls
│   └── index.js                # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useSpas.js              # Hook for fetching spas
│   ├── useSpaFilters.js       # Hook for filtering logic
│   ├── usePagination.js        # Hook for pagination logic
│   └── index.js                # Hook exports
│
├── utils/                   # Utility functions
│   ├── spaUtils.js             # Spa data utilities (display names, location, filtering)
│   └── index.js                # Utility exports
│
├── constants.js             # Constants (items per page, form data, address fields)
├── SpasListPage.jsx        # Main spas list page
├── AddSpaPage.jsx          # Add new spa page
├── EditSpaPage.jsx         # Edit spa page
├── SpaViewPage.jsx         # View spa details page
├── index.js                 # Page exports
└── README.md               # This file
```

## Components

### SpaHeader
- Displays page title and total spa count
- Add new spa button
- Gradient background design (indigo → purple → pink)

### SpaFilters
- Search input for filtering spas
- State filter dropdown
- City filter dropdown
- Phone filter input
- Clear filters button when filters are active

### SpaTable / SpaCardList
- Desktop: Table view with SpaRow
- Mobile: Card view with SpaCard
- Both handle the same actions (edit, delete)

### SpaRow / SpaCard
- Displays spa information (name, state, city, website, phone)
- Action buttons (Edit, Delete)
- Website links with external icon

### Pagination
- Previous/Next buttons
- Page number buttons (shows up to 5 pages)
- Items range display
- Responsive layout

## Hooks

### useSpas
- Fetches spas from API
- Handles loading and error states
- Sorts spas alphabetically by name
- Provides refetch function

### useSpaFilters
- Filters spas by search term
- Filters spas by state, city, and phone
- Returns filtered spas

### usePagination
- Handles pagination logic
- Calculates current page items
- Provides navigation methods
- Auto-resets to page 1 when items change

## Utils

### spaUtils
- `getSpaDisplayName()` - Get spa display name
- `getSpaLocation()` - Get spa location string (city, state)
- `formatWebsite()` - Format website URL for display
- `filterSpas()` - Filter spas by search term and filters
- `sortSpasByName()` - Sort spas alphabetically
- `getFilterOptions()` - Get unique filter options from spas

## Constants

- `ITEMS_PER_PAGE` - Number of spas per page (15)
- `ADDRESS_FIELDS` - Address field definitions
- `INITIAL_FORM_DATA` - Initial form data structure

## Pages

### SpasListPage
- Main page for listing and managing spas
- Add, edit, delete spas
- Search and filter functionality
- Pagination support
- Responsive design (table for desktop, cards for mobile)

### AddSpaPage
- Form for adding new spas
- Address fields, contact info, gallery images
- Form validation

### EditSpaPage
- Form for editing existing spas
- Pre-populated with spa data
- Form validation

### SpaViewPage
- View spa details
- Display all spa information
- Image gallery
- Location information

## Features

- **Search**: Filter spas by name or address
- **State/City Filter**: Filter spas by location
- **Phone Filter**: Filter spas by phone number
- **Pagination**: Navigate through pages (15 per page)
- **Add Spa**: Create new spas with comprehensive form
- **Edit Spa**: Update existing spa information
- **Delete Spa**: Delete spas with confirmation
- **View Spa**: View detailed spa information
- **Responsive**: Desktop table view and mobile card view
- **Alphabetical Sorting**: Spas sorted by name

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/hook can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

