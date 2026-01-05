# Quick Reference Guide

## 📦 Import Patterns

### Common Components
```javascript
import { 
  InputField, 
  SectionHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  EmptyState, 
  ConfirmDialog 
} from '../components/common';
```

### Layout Components
```javascript
import { Layout, Sidebar, FloatingNavigator } from '../components/layout';
```

### Dashboard Components
```javascript
import { KeyMetricsSection, ChartsSection, RecentActivity } from '../components/dashboard';
```

### API Services
```javascript
import { 
  authService, 
  userService, 
  jobService, 
  spaService,
  applicationService,
  messageService,
  statsService,
  subscriberService
} from '../api';
```

### Hooks
```javascript
import { useApi, usePagination } from '../hooks';
```

### Constants
```javascript
import { 
  APPLICATION_STATUSES, 
  JOB_STATUSES, 
  USER_ROLES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  FILE_UPLOAD
} from '../constants';
```

### Utils
```javascript
import { getToken, constructImageUrl } from '../utils';
```

## 🎯 Common Patterns

### API Call with Hook
```javascript
import { useApi } from '../hooks';
import { jobService } from '../api';

const MyComponent = () => {
  const { data, loading, error, refetch } = useApi(
    () => jobService.getAllJobs(),
    []
  );
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data?.length) return <EmptyState title="No jobs found" />;
  
  return <div>{/* render data */}</div>;
};
```

### Pagination
```javascript
import { usePagination } from '../hooks';

const MyComponent = () => {
  const { 
    currentPage, 
    totalPages, 
    paginatedItems, 
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = usePagination(items, 10);
  
  return (
    <>
      {paginatedItems.map(item => <Item key={item.id} {...item} />)}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrev={prevPage}
        hasNext={hasNextPage}
        hasPrev={hasPrevPage}
      />
    </>
  );
};
```

### Form with Validation
```javascript
import { InputField, ErrorMessage } from '../components/common';
import { VALIDATION } from '../constants';

const MyForm = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  
  const validateEmail = (email) => {
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email' }));
      return false;
    }
    return true;
  };
  
  return (
    <form>
      <InputField
        label="Email"
        name="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          if (errors.email) setErrors({ ...errors, email: '' });
        }}
        error={errors.email}
        required
      />
    </form>
  );
};
```

### Delete Confirmation
```javascript
import { ConfirmDialog } from '../components/common';
import { useState } from 'react';

const MyComponent = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };
  
  const confirmDelete = async () => {
    await deleteItem(itemToDelete.id);
    setShowConfirm(false);
    setItemToDelete(null);
  };
  
  return (
    <>
      <button onClick={() => handleDelete(item)}>Delete</button>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        variant="danger"
      />
    </>
  );
};
```

### Status Badge
```javascript
import { APPLICATION_STATUSES } from '../constants';

const StatusBadge = ({ status }) => {
  const statusColors = {
    [APPLICATION_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
    [APPLICATION_STATUSES.SHORTLISTED]: 'bg-blue-100 text-blue-800',
    [APPLICATION_STATUSES.REJECTED]: 'bg-red-100 text-red-800',
    [APPLICATION_STATUSES.HIRED]: 'bg-green-100 text-green-800',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
};
```

## 📁 File Locations

### Where to Put New Files

- **Reusable UI Component** → `components/common/`
- **Layout/Navigation Component** → `components/layout/`
- **Form Component** → `components/forms/`
- **Dashboard Widget** → `components/dashboard/`
- **Page Component** → `pages/{feature}/`
- **Custom Hook** → `hooks/`
- **Constant** → `constants/index.js`
- **Utility Function** → `utils/`
- **API Service** → `api/services/`

## 🔍 Finding Files

- **Common Components**: `src/components/common/`
- **Layout**: `src/components/layout/`
- **Pages**: `src/pages/{feature}/`
- **API Services**: `src/api/services/`
- **Hooks**: `src/hooks/`
- **Constants**: `src/constants/`
- **Utils**: `src/utils/`

