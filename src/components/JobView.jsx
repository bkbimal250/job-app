import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  AlertCircle
} from 'lucide-react';

const JobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/spajobs/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        
        setJob(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        
        // Detailed error handling
        if (err.response) {
          // The request was made and server responded with error status
          if (err.response.status === 404) {
            setError("Job not found. It may have been deleted.");
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError("You don't have permission to view this job. Please log in again.");
          } else {
            setError(`Server error: ${err.response.data?.message || err.response.statusText}`);
          }
        } else if (err.request) {
          // The request was made but no response received
          setError("Network error. Please check your internet connection.");
        } else {
          // Something else caused the error
          setError(`Error: ${err.message}`);
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

  // Function to handle category display
  const getCategoryDisplayName = (category) => {
    if (!category) return '-';
    return typeof category === 'string' ? category : (category.name || '-');
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <button 
              onClick={handleGoBack} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Jobs List
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <Briefcase className="mr-3 text-blue-600 h-6 w-6 sm:h-7 sm:w-7" />
              {job.title}
              {job.isNewJob && (
                <span className="ml-3 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  NEW
                </span>
              )}
            </h1>
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
                    <p className="font-medium">{job.location || '-'}, {job.city || '-'}, {job.state || '-'}</p>
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
                    <p className="font-medium">{job.salary || 'Not specified'}</p>
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
      </div>
    </div>
  );
};

export default JobView;