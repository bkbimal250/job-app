// Application Constants
export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired'
};

export const CSV_HEADERS = [
  { label: 'Job Title', key: 'job.title' },
  { label: 'Spa Name', key: 'spa.name' },
  { label: 'Full Name', key: 'candidate.fullName' },
  { label: 'Email', key: 'candidate.email' },
  { label: 'Phone', key: 'candidate.phone' },
  { label: 'Resume', key: 'resume' },
  { label: 'Cover Letter', key: 'coverLetter' },
  { label: 'Status', key: 'status' },
  { label: 'Applied At', key: 'appliedAt' },
];

export const RESUME_BASE_URL = 'https://www.apispajobs.co.in';

