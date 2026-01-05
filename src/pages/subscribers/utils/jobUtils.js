// Job Utility Functions for Subscribers

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
 * Filter jobs by search term
 * @param {Array} jobs - Array of jobs
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered jobs
 */
export const filterJobs = (jobs, searchTerm) => {
  if (!Array.isArray(jobs) || !searchTerm) return jobs;
  
  const term = searchTerm.toLowerCase();
  return jobs.filter(job => {
    const category = getCategoryDisplayName(job.category);
    return (
      job.title?.toLowerCase().includes(term) ||
      category.toLowerCase().includes(term) ||
      (job.location || '').toLowerCase().includes(term) ||
      (job.state || '').toLowerCase().includes(term)
    );
  });
};

