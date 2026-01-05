# Users Page Structure

This directory contains the Users Management pages, organized into modular, reusable components and utilities.

## File Structure

```
users/
├── components/              # React components
│   ├── UserHeader.jsx            # Page header with title and add button
│   ├── UserFilters.jsx          # Filter section (search, role filter)
│   ├── UserTable.jsx            # Desktop table view
│   ├── UserCardList.jsx         # Mobile card view
│   ├── UserRow.jsx              # Single table row (desktop)
│   ├── UserCard.jsx             # Single card (mobile)
│   ├── UserAvatar.jsx           # User avatar component
│   ├── AddUserModal.jsx         # Modal for adding new user
│   └── index.js                 # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useUsers.js              # Hook for fetching users
│   ├── useUserFilters.js       # Hook for filtering logic
│   └── index.js                 # Hook exports
│
├── utils/                   # Utility functions
│   ├── userUtils.js             # User data utilities (display names, badges, filtering)
│   ├── formUtils.js             # Form validation and utilities
│   └── index.js                 # Utility exports
│
├── constants.js             # Constants (roles, genders, badge colors)
├── UsersListPage.jsx        # Main users list page
├── UserViewPage.jsx         # User profile view page
├── UserEditPage.jsx         # User profile edit page
├── index.js                 # Page exports
└── README.md               # This file
```

## Components

### UserHeader
- Displays page title and total user count
- Add new user button
- Gradient background design

### UserFilters
- Search input for filtering users
- Role filter dropdown
- Clear filters button when filters are active

### UserTable / UserCardList
- Desktop: Table view with UserRow
- Mobile: Card view with UserCard
- Both handle the same actions (delete)

### UserRow / UserCard
- Displays user information (name, email, phone, role, gender)
- User avatar with fallback
- Action buttons (Delete)

### UserAvatar
- Displays user profile image or initials
- Supports different sizes (sm, md, lg)
- Fallback to generated avatar

### AddUserModal
- Modal for adding new users
- Form validation
- Auto-generates full name from first and last name

## Hooks

### useUsers
- Fetches users from API
- Handles loading and error states
- Provides refetch function

### useUserFilters
- Filters users by search term
- Filters users by role
- Returns filtered users

## Utils

### userUtils
- `getRoleBadgeColor()` - Get Tailwind classes for role badge
- `getUserDisplayName()` - Get user display name
- `getUserInitials()` - Get user initials for avatar
- `filterUsers()` - Filter users by search term and role
- `isValidEmail()` - Validate email format
- `isValidPhone()` - Validate phone number
- `isValidPassword()` - Validate password

### formUtils
- `validateUserForm()` - Validate user form data
- `generateFullName()` - Generate full name from first and last name
- `cleanFormData()` - Clean form data (trim strings)

## Constants

- `USER_ROLES` - Role enum (admin, user, spamanager)
- `USER_GENDERS` - Gender enum (Male, Female, Other)
- `ROLE_BADGE_COLORS` - Tailwind classes for role badges
- `ITEMS_PER_PAGE` - Number of users per page (15)

## Pages

### UsersListPage
- Main page for listing and managing users
- Add, delete users
- Search and filter functionality
- Responsive design (table for desktop, cards for mobile)

### UserViewPage
- View user profile details
- Display personal and professional information
- Profile photo management

### UserEditPage
- Edit user profile
- Form for updating user information
- Skills management

## Features

- **Search**: Filter users by name, email, or phone
- **Role Filter**: Filter users by role (admin, user, spamanager)
- **Add User**: Create new users with validation
- **Delete User**: Delete users with confirmation
- **Responsive**: Desktop table view and mobile card view
- **Avatar Support**: Profile images with fallback to initials
- **Form Validation**: Comprehensive validation for user forms

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/utility can be tested independently
5. **Scalability**: Easy to add new features or modify existing ones

