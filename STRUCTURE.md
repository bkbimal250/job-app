# Job App - Admin Dashboard Structure

## 📁 New File Structure

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
│   │   ├── stats.service.js      # Statistics services
│   │   └── subscriber.service.js # Subscriber services
│   └── index.js                  # Central export point
│
├── components/                   # Reusable Components
│   ├── auth/                    # Authentication components
│   │   └── Login.jsx
│   ├── layout/                  # Layout components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── FloatingNavigator.jsx
│   ├── common/                  # Shared components
│   │   ├── InputField.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── ProfilePhotoCard.jsx
│   │   └── ...
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── KeyMetricsSection.jsx
│   │   ├── ChartsSection.jsx
│   │   └── RecentActivity.jsx
│   └── style/                   # Component styles
│       └── application.css
│
├── pages/                        # Page Components
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── jobs/
│   │   ├── Jobs.jsx
│   │   ├── AddSpaJobForm.jsx
│   │   ├── EditSpaJobForm.jsx
│   │   └── JobView.jsx
│   ├── spas/
│   │   ├── Spas.jsx
│   │   ├── AddSpaForm.jsx
│   │   ├── EditSpaForm.jsx
│   │   └── SpaView.jsx
│   ├── users/
│   │   ├── GetAllUser.jsx
│   │   ├── Viewprofile.jsx
│   │   └── Editprofile.jsx
│   ├── applications/
│   │   └── Applications.jsx
│   ├── messages/
│   │   └── Messages.jsx
│   └── subscribers/
│       └── Suscribers.jsx
│
├── routes/                       # Route Configuration
│   ├── AppRoutes.jsx            # Main router component
│   └── routes.config.js         # Route definitions
│
├── auth/                         # Authentication
│   ├── AuthContext.jsx
│   └── PrivateRoute.jsx
│
├── utils/                        # Utility Functions
│   ├── getToken.js
│   └── constructImageUrl.js
│
├── services/                     # Legacy services (can be migrated)
│   └── authService.js
│
├── App.jsx                       # Main App component (updated)
├── main.jsx                      # Entry point (updated)
└── index.css                     # Global styles
```

## 🔄 Migration Steps

### 1. API Structure ✅
- Created `api/config/axios.js` - Centralized axios instance
- Created `api/config/endpoints.js` - All endpoint definitions
- Created `api/services/*.service.js` - Organized by domain
- Created `api/index.js` - Central exports

### 2. Components Organization (Next)
- Move components to feature-based folders
- Separate layout components
- Organize common/shared components

### 3. Pages Organization (Next)
- Move page components to `pages/` directory
- Organize by feature (dashboard, jobs, spas, users, etc.)

### 4. Routes (Next)
- Created `routes/AppRoutes.jsx` - Main router
- Created `routes/routes.config.js` - Route configuration

### 5. Update Imports (Next)
- Update all files to use new API structure
- Update component imports
- Update page imports

## 📝 Usage Examples

### Using API Services

```javascript
// Old way (deprecated)
import { fetchAllSpas } from '../api/spaAPI';

// New way
import { spaService } from '../api';
// or
import spaService from '../api/services/spa.service';

// Usage
const spas = await spaService.getAllSpas();
```

### Using Routes

```javascript
import { routePaths } from '../routes/routes.config';

// Navigate to edit spa
navigate(routePaths.editSpa(spaId));
```

## ✅ Benefits

1. **Better Organization**: Files grouped by feature/domain
2. **Easier Maintenance**: Clear separation of concerns
3. **Scalability**: Easy to add new features
4. **Consistency**: Follows same pattern as dishajobs
5. **Type Safety**: Ready for TypeScript migration
6. **Reusability**: Services can be easily reused

