// Application Utility Functions

/**
 * Get applicant name from application object
 * @param {Object} application - Application object
 * @returns {string} Applicant name
 */
export const getApplicantName = (application) => {
  const applicant = application.candidate || application.guestInfo;
  
  return (
    applicant?.fullName ||
    `${applicant?.firstname || ''} ${applicant?.lastname || ''}`.trim() ||
    applicant?.name ||
    'Unnamed Applicant'
  );
};

/**
 * Get applicant email
 * @param {Object} application - Application object
 * @returns {string} Applicant email
 */
export const getApplicantEmail = (application) => {
  const applicant = application.candidate || application.guestInfo;
  return applicant?.email || 'N/A';
};

/**
 * Get applicant phone
 * @param {Object} application - Application object
 * @returns {string} Applicant phone
 */
export const getApplicantPhone = (application) => {
  const applicant = application.candidate || application.guestInfo;
  return applicant?.phone || 'N/A';
};

/**
 * Get resume path from application
 * @param {Object} application - Application object
 * @returns {string|null} Resume path or null
 */
export const getResumePath = (application) => {
  return application.candidate?.resume || application.resume || null;
};

/**
 * Filter applications by job title/spa name and status
 * @param {Array} applications - Array of applications
 * @param {string} jobFilter - Job title or spa name filter
 * @param {string} statusFilter - Status filter
 * @returns {Array} Filtered applications
 */
export const filterApplications = (applications, jobFilter, statusFilter) => {
  if (!Array.isArray(applications)) return [];

  return applications.filter((application) => {
    if (!application) return false;

    // Check if job title matches filter
    const matchesJob =
      !jobFilter ||
      (application.job?.title?.toLowerCase().includes(jobFilter.toLowerCase()) ?? false) ||
      (application.job?.spa?.name?.toLowerCase().includes(jobFilter.toLowerCase()) ?? false);

    // Check if status matches filter
    const matchesStatus =
      !statusFilter ||
      (application.status?.toLowerCase() === statusFilter.toLowerCase());

    return matchesJob && matchesStatus;
  });
};

/**
 * Prepare CSV data from applications
 * @param {Array} applications - Array of applications
 * @returns {Array} CSV data array
 */
export const prepareCsvData = (applications) => {
  return applications.map((application) => ({
    'job.title': application.job?.title || '',
    'spa.name': application.job?.spa?.name || '',
    'candidate.fullName': getApplicantName(application),
    'candidate.email': getApplicantEmail(application),
    'candidate.phone': getApplicantPhone(application),
    resume: getResumePath(application) ? 'Available' : 'No Resume',
    coverLetter: application.coverLetter || 'No Cover Letter',
    status: application.status || '',
    appliedAt: application.appliedAt
      ? new Date(application.appliedAt).toLocaleString()
      : '',
  }));
};

