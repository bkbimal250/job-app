# Job App - Improved File Structure

## 📁 Complete File Structure

```
job-app/src/
├── api/                          # API Services (Organized by Domain)
│   ├── config/
│   │   ├── axios.js             # Axios instance configuration
│   │   └── endpoints.js         # API endpoints constants
│   ├── services/
│   │   ├── auth.service.js      # Authentication services
│   │   ├── user.service.js      # User management services
│   │   ├── job.service.js       # Job-related API calls
│   │   ├── spa.service.js       # Spa/Company API calls
│   │   ├── application.service.js # Application services
│   │   ├── message.service.js   # Message services
│   │   ├── stats.service.js     # Statistics services
│   │   └── subscriber.service.js # Subscriber services
│   └── index.js                  # Central export point
│
├── components/                   # React Components
│   ├── common/                  # Reusable/Shared Components
│   │   ├── InputField.jsx       # Form input component
│   │   ├── SectionHeader.jsx    # Section header component
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   ├── ErrorMessage.jsx     # Error display component
│   │   ├── EmptyState.jsx      # Empty state component
│   │   ├── ConfirmDialog.jsx    # Confirmation dialog
│   │   └── index.js            # Common components exports
│   │
│   ├── layout/                  # Layout Components
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── FloatingNavigator.jsx # Floating navigation
│   │
│   ├── forms/                  # Form Components
│   │   ├── AddSpaForm.jsx      # Add spa form
│   │   ├── EditSpaForm.jsx      # Edit spa form
│   │   ├── AddSpaJobForm.jsx   # Add job form
│   │   └── EditSpaJobForm.jsx  # Edit job form
│   │
│   ├── dashboard/              # Dashboard-specific Components
│   │   ├── KeyMetricsSection.jsx
│   │   ├── ChartsSection.jsx
│   │   └── RecentActivity.jsx
│   │
│   └── style/                  # Component styles
│       └── application.css
│
├── pages/                       # Page Components (Route-level)
│   ├── dashboard/
│   │   └── Dashboard.jsx       # Main dashboard page
│   │
│   ├── jobs/
│   │   ├── Jobs.jsx            # Jobs listing page
│   │   ├── JobView.jsx         # Job detail page
│   │   ├── AddJob.jsx          # Add job page
│   │   └── EditJob.jsx         # Edit job page
│   │
│   ├── spas/
│   │   ├── Spas.jsx            # Spas listing page
│   │   ├── SpaView.jsx         # Spa detail page
│   │   ├── AddSpa.jsx          # Add spa page
│   │   └── EditSpa.jsx         # Edit spa page
│   │
│   ├── users/
│   │   ├── Users.jsx           # Users listing page
│   │   ├── ViewProfile.jsx    # View user profile
│   │   └── EditProfile.jsx    # Edit user profile
│   │
│   ├── applications/
│   │   └── Applications.jsx    # Applications listing page
│   │
│   ├── messages/
│   │   └── Messages.jsx       # Messages page
│   │
│   └── subscribers/
│       └── Subscribers.jsx    # Subscribers page
│
├── hooks/                       # Custom React Hooks
│   ├── useApi.js              # API call hook with loading/error
│   ├── usePagination.js       # Pagination hook
│   └── index.js               # Hooks exports
│
├── constants/                   # Application Constants
│   └── index.js               # All constants (statuses, configs, etc.)
│
├── utils/                       # Utility Functions
│   ├── getToken.js            # Get auth token
│   └── constructImageUrl.js   # Image URL constructor
│
├── auth/                        # Authentication
│   ├── AuthContext.jsx        # Auth context provider
│   └── PrivateRoute.jsx      # Protected route wrapper
│
├── routes/                      # Route Configuration
│   ├── AppRoutes.jsx          # Main router component
│   └── routes.config.js      # Route definitions
│
├── App.jsx                      # Main App component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

## 🎯 Component Organization Principles

### 1. **Common Components** (`components/common/`)
- Reusable across multiple pages
- No business logic, pure presentation
- Examples: InputField, LoadingSpinner, ErrorMessage

### 2. **Layout Components** (`components/layout/`)
- Structure and navigation
- Examples: Layout, Sidebar, Header

### 3. **Form Components** (`components/forms/`)
- Reusable form components
- Can contain form-specific logic
- Examples: AddSpaForm, EditJobForm

### 4. **Dashboard Components** (`components/dashboard/`)
- Specific to dashboard functionality
- Examples: KeyMetricsSection, ChartsSection

### 5. **Pages** (`pages/`)
- Route-level components
- Orchestrate multiple components
- Handle page-level state and logic

## 📦 API Usage Pattern

### Using Services
```javascript
// Import from services
import { jobService } from '../api';
// or
import jobService from '../api/services/job.service';

// Use in component
const jobs = await jobService.getAllJobs();
```

### Using Hooks
```javascript
import { useApi } from '../hooks';
import { jobService } from '../api';

const MyComponent = () => {
  const { data, loading, error, refetch } = useApi(
    () => jobService.getAllJobs(),
    []
  );
  
  // ...
};
```

## 🔧 Constants Usage

```javascript
import { APPLICATION_STATUSES, ERROR_MESSAGES } from '../constants';

// Use constants
if (status === APPLICATION_STATUSES.PENDING) {
  // ...
}
```

## 📝 Import Patterns

### Absolute Imports (Recommended)
```javascript
// From pages
import { InputField, LoadingSpinner } from '../../components/common';
import { useApi } from '../../hooks';
import { APPLICATION_STATUSES } from '../../constants';
import { jobService } from '../../api';
```

### Relative Imports (For nearby files)
```javascript
// Within same folder
import Component from './Component';
```

## ✅ Benefits

1. **Scalability**: Easy to add new features
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Common components can be shared
4. **Testability**: Isolated components are easier to test
5. **Consistency**: Follows industry best practices
6. **Developer Experience**: Easy to find and navigate files

## 🚀 Migration Checklist

- [x] Create folder structure
- [x] Create common components
- [x] Create hooks
- [x] Create constants
- [ ] Move layout components
- [ ] Move form components
- [ ] Move dashboard components
- [ ] Move page components
- [ ] Update all imports
- [ ] Remove old API files
- [ ] Update routes
- [ ] Test all pages

