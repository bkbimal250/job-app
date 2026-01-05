import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../../api/services/job.service';
import { ConfirmDialog } from '../../components/common';

import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  Users,
  Calendar,
  Tag,
  Phone,
  MessageSquare,
  Check,
  AlertCircle,
  Pencil,
  Trash2
} from 'lucide-react';

const JobViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const jobData = await jobService.getJobById(id);
        // Handle nested response structure
        const job = jobData?.data || jobData;
        setJob(job);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        
        // Detailed error handling
        if (err.response?.status === 404) {
          setError("Job not found. It may have been deleted.");
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError("You don't have permission to view this job. Please log in again.");
        } else {
          const errorMessage = err.response?.data?.message || 
                              err.message || 
                              "Failed to load job details. Please try again.";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/jobs');
  };

  const handleEdit = () => {
    navigate(`/job/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await jobService.deleteJob(id);
      navigate('/jobs');
    } catch (err) {
      console.error("Error deleting job:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete job. Please try again.");
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // Function to handle category display
  const getCategoryDisplayName = (category) => {
    if (!category) return '-';
    return typeof category === 'string' ? category : (category.name || '-');
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `₹${salary.toLocaleString('en-IN')}`;
    }
    if (typeof salary === 'string' && salary.trim()) {
      // Check if it's already formatted or just a number string
      if (salary.startsWith('₹') || salary.startsWith('$')) {
        return salary;
      }
      const numSalary = parseFloat(salary);
      if (!isNaN(numSalary)) {
        return `₹${numSalary.toLocaleString('en-IN')}`;
      }
      return salary;
    }
    return 'Not specified';
  };

  // Function to format location
  const formatLocation = () => {
    const parts = [];
    if (job.location) parts.push(job.location);
    if (job.city) parts.push(job.city);
    if (job.state) parts.push(job.state);
    
    if (parts.length === 0) return '-';
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Loading Job Details</h3>
          <p className="text-gray-500">Retrieving information about this position...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-6 inline-flex">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Job</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs List
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="bg-yellow-100 rounded-full p-4 mx-auto mb-6 inline-flex">
            <AlertCircle className="h-10 w-10 text-yellow-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Job Not Found</h3>
          <p className="text-gray-500 mb-6">We couldn't find the job you're looking for.</p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button and Title */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGoBack} 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Jobs List
              </button>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                {job.title || 'Untitled Job'}
                {job.isNewJob && (
                  <span className="ml-3 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    NEW
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="text-blue-600 h-6 w-6 hidden sm:block" />
              <button
                onClick={handleEdit}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <Pencil className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <Trash2 className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Job Overview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-600" />
                Job Overview
              </h2>
              
              <div className="space-y-4">
                {/* Category */}
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{getCategoryDisplayName(job.category)}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg mr-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{formatLocation()}</p>
                  </div>
                </div>
                
                {/* Spa */}
                <div className="flex items-start">
                  <div className="bg-purple-50 p-2 rounded-lg mr-3">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spa</p>
                    <p className="font-medium">{job.spa?.name || '-'}</p>
                  </div>
                </div>
                
                {/* Salary */}
                <div className="flex items-start">
                  <div className="bg-amber-50 p-2 rounded-lg mr-3">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{formatSalary(job.salary)}</p>
                  </div>
                </div>
                
                {/* Vacancies */}
                <div className="flex items-start">
                  <div className="bg-cyan-50 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vacancies</p>
                    <p className="font-medium">{job.vacancies || 1} Position{job.vacancies !== 1 && 's'}</p>
                  </div>
                </div>
                
                {/* Experience */}
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience Required</p>
                    <p className="font-medium">{job.experience || 'Not specified'}</p>
                  </div>
                </div>
                
                {/* Posted Date */}
                <div className="flex items-start">
                  <div className="bg-pink-50 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-medium">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Information */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Phone className="mr-2 text-blue-600" />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {/* HR Phone */}
                <div className="flex items-start">
                  <div className="bg-rose-50 p-2 rounded-lg mr-3">
                    <Phone className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">HR Phone</p>
                    <p className="font-medium">
                      {job.hrPhone ? (
                        <a href={`tel:${job.hrPhone}`} className="text-blue-600 hover:underline">
                          {job.hrPhone}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                {/* HR WhatsApp */}
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg mr-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">HR WhatsApp</p>
                    <p className="font-medium">
                      {job.hrWhatsapp ? (
                        <a 
                          href={`https://wa.me/+91${job.hrWhatsapp.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {job.hrWhatsapp}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                {/* Gender Preference */}
                {job.gender && job.gender !== 'Any' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Note:</span> This position has a gender preference of <span className="font-medium">{job.gender}</span>.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Application Count */}
                {job.applications !== undefined && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Applications so far</p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">
                        {Array.isArray(job.applications) ? job.applications.length : (job.applications || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description and Requirements */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Description Section */}
          {job.description && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-600" />
                Job Description
              </h2>
              <div className="prose max-w-none">
                {job.description.split('\n').map((paragraph, idx) => (
                  paragraph ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
                ))}
              </div>
            </div>
          )}
          
          {/* Requirements Section */}
          {job.requirements && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Check className="mr-2 text-green-600" />
                Requirements
              </h2>
              <div className="prose max-w-none">
                {job.requirements.split('\n').map((requirement, idx) => (
                  requirement.trim() ? (
                    <div key={idx} className="flex items-start mb-3">
                      <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p>{requirement}</p>
                    </div>
                  ) : <br key={idx} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm}
          onClose={() => setDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Job"
          message={`Are you sure you want to delete "${job.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleting}
        />
      </div>
    </div>
  );
};

export default JobViewPage;