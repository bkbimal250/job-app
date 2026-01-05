// Job Utility Functions

/**
 * Get category display name
 * @param {Object|string} category - Category object or string
 * @returns {string} Category display name
 */
export const getCategoryDisplayName = (category) => {
  if (!category) return '-';
  return typeof category === 'string' ? category : (category.name || '-');
};

/**
 * Get job location string
 * @param {Object} job - Job object
 * @returns {string} Location string
 */
export const getJobLocation = (job) => {
  if (!job) return 'N/A';
  const { location, state } = job;
  if (location && state) return `${location}, ${state}`;
  if (location) return location;
  if (state) return state;
  return 'N/A';
};

/**
 * Format salary for display
 * @param {number|string} salary - Salary value
 * @returns {string} Formatted salary
 */
export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  if (typeof salary === 'number') {
    return `$${salary.toLocaleString()}`;
  }
  return salary;
};

/**
 * Format date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Filter jobs by search term and filters
 * @param {Array} jobs - Array of jobs
 * @param {string} searchTerm - Search term
 * @param {string} categoryFilter - Category filter
 * @param {string} locationFilter - Location filter
 * @param {string} spaFilter - Spa filter
 * @returns {Array} Filtered jobs
 */
export const filterJobs = (jobs, searchTerm, categoryFilter, locationFilter, spaFilter) => {
  if (!Array.isArray(jobs)) return [];

  const lowerSearch = searchTerm.toLowerCase();
  
  return jobs.filter((job) => {
    // Handle search
    const matchesSearch = !searchTerm || 
      (job.title?.toLowerCase().includes(lowerSearch)) ||
      (job.spa?.name?.toLowerCase().includes(lowerSearch));
    
    // Handle category filtering
    const jobCategory = getCategoryDisplayName(job.category);
    const matchesCategory = categoryFilter === 'all' || jobCategory === categoryFilter;
    
    // Handle location filtering
    const matchesLocation = locationFilter === 'all' || job.state === locationFilter;
    
    // Handle spa filtering
    const matchesSpa = spaFilter === 'all' || (job.spa?.name === spaFilter);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesSpa;
  });
};

/**
 * Get unique filter options from jobs
 * @param {Array} jobs - Array of jobs
 * @param {string} type - Type of filter (category, location, spa)
 * @returns {Array} Sorted unique options
 */
export const getFilterOptions = (jobs, type) => {
  if (!Array.isArray(jobs)) return [];
  
  const options = new Set();
  
  jobs.forEach((job) => {
    if (type === 'category') {
      const category = getCategoryDisplayName(job.category);
      if (category && category !== '-') {
        options.add(category);
      }
    } else if (type === 'location') {
      if (job.state) {
        options.add(job.state);
      }
    } else if (type === 'spa') {
      if (job.spa?.name) {
        options.add(job.spa.name);
      }
    }
  });
  
  return Array.from(options).sort((a, b) => a.localeCompare(b));
};

