import React, { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Building2, Pencil, Eye, Trash2, Tag, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getToken } from '../utils/getToken';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Jobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [spaFilter, setSpaFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/spajobs`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setJobs(response.data);
        setError('');
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load jobs data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [token]);

  // Extract unique values for filters - updated for direct category string
  const getCategoryOptions = () => {
    const categories = new Set();
    jobs.forEach(job => {
      if (job.category) {
        // Handle both string and object category formats
        const categoryName = typeof job.category === 'string' ? job.category : job.category.name;
        if (categoryName) {
          categories.add(categoryName);
        }
      }
    });
    return Array.from(categories);
  };

  const getLocationOptions = () => {
    const locations = new Set();
    jobs.forEach(job => {
      if (job.state) {
        locations.add(job.state);
      }
    });
    return Array.from(locations);
  };

  const getSpaOptions = () => {
    const spas = new Set();
    jobs.forEach(job => {
      if (job.spa && job.spa.name) {
        spas.add(job.spa.name);
      }
    });
    return Array.from(spas);
  };

  // Filter jobs based on search and filter criteria - updated for direct category string
  const filteredJobs = jobs.filter(job => {
    // Handle search
    const matchesSearch = searchTerm === '' || 
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.spa && job.spa.name && job.spa.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle category filtering with both object and string formats
    const jobCategory = typeof job.category === 'string' ? job.category : (job.category?.name || '');
    const matchesCategory = categoryFilter === 'all' || jobCategory === categoryFilter;
    
    // Handle location filtering
    const matchesLocation = locationFilter === 'all' || job.state === locationFilter;
    
    // Handle spa filtering
    const matchesSpa = spaFilter === 'all' || (job.spa && job.spa.name === spaFilter);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesSpa;
  });

  // Pagination calculation
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleAddJob = () => {
    // Navigate to the AddSpaJobForm page
    navigate('/add-spa-job');
  };

  // Updated to use navigation instead of modal
  const handleEditJob = (job) => {
    // Navigate to the EditSpaJobForm page with the job ID
    navigate(`/job/${job._id}`);
  };

  const handleViewJob = (job) => {
    // Navigate to view job details page
    navigate(`/view-job/${job._id}`);
  };

  const handleDeleteJob = async (job) => {
    if (window.confirm(`Are you sure you want to delete ${job.title} position?`)) {
      try {
        await axios.delete(`${BASE_URL}/spajobs/${job._id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        
        // Remove the deleted job from the list
        setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
      } catch (err) {
        console.error("Delete error:", err);
        setError("Failed to delete job. Please try again.");
      }
    }
  };

  // Get category display name
  const getCategoryDisplayName = (job) => {
    // Handle both string and object category formats
    if (!job.category) return '-';
    return typeof job.category === 'string' ? job.category : (job.category.name || '-');
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, locationFilter, spaFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">Job Management</h1>
          <button
            onClick={handleAddJob}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200 shadow-sm"
          >
            <Plus className="mr-2" size={20} />
            Add New Job
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center shadow-sm">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg mb-6 border border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {getCategoryOptions().map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {getLocationOptions().map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Spa</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={spaFilter}
                  onChange={(e) => setSpaFilter(e.target.value)}
                >
                  <option value="all">All Spas</option>
                  {getSpaOptions().map((spa, index) => (
                    <option key={index} value={spa}>{spa}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-indigo-50 rounded-full p-4 inline-flex mx-auto mb-4">
                <Search className="text-indigo-400" size={24} />
              </div>
              <p className="text-slate-700 text-lg mb-2">No jobs found</p>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Spa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {currentJobs.map((job, index) => (
                      <tr key={job._id || index} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <span className="text-indigo-800">{job.title}</span>
                            {job.isNewJob && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag size={16} className="mr-1 text-indigo-500" />
                            <span className="text-slate-700">{getCategoryDisplayName(job)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 size={16} className="mr-1 text-purple-500" />
                            <span className="text-slate-700">{job.spa?.name || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1 text-emerald-500" />
                            <span className="text-slate-700">{job.location || '-'}, {job.state || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-slate-800">{job.salary || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-800 rounded-full">
                            {job.applications || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center justify-center space-x-3">
                            <button 
                              onClick={() => handleEditJob(job)}
                              className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-full transition shadow-sm" 
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleViewJob(job)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full transition shadow-sm" 
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job)}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition shadow-sm" 
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing <span className="font-medium text-indigo-700">{indexOfFirstJob + 1}</span> to <span className="font-medium text-indigo-700">{Math.min(indexOfLastJob, filteredJobs.length)}</span> of <span className="font-medium text-indigo-700">{filteredJobs.length}</span> jobs
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                        currentPage === 1 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-300'
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    {/* Page number buttons */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNum;
                        
                        // Display logic for showing relevant page numbers
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = idx + 1;
                        } else if (currentPage <= 3) {
                          // If on pages 1-3, show pages 1-5
                          pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If on last 3 pages, show last 5 pages
                          pageNum = totalPages - 4 + idx;
                        } else {
                          // Otherwise show current page and 2 on each side
                          pageNum = currentPage - 2 + idx;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {/* Show ellipsis if there are more pages */}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="flex items-center justify-center w-8 h-8 text-slate-500">...</span>
                      )}
                      
                      {/* Always show last page if there are more than 5 pages and we're not already showing it */}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => paginate(totalPages)}
                          className="flex items-center justify-center w-8 h-8 rounded-md transition bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                        currentPage === totalPages 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-300'
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;