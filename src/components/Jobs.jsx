import React, { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Building2, Pencil, Eye, Trash2 } from 'lucide-react';
import AddSpaJobForm from './AddSpaJobForm';
import EditSpaJobForm from './EditSpaJobForm';
import { getToken } from '../utils/getToken';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { useContext } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [spaFilter, setSpaFilter] = useState('all');
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [showEditJobForm, setShowEditJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [job, setJob] = useState([]);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setJob(response.data);
        setError('');

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load jobs data.");
      }
    };
    
    fetchJobs();
  }, [token]);

  // Extract unique values for filters
  const getCategoryOptions = () => {
    const categories = new Set();
    job.forEach(data => {
      if (data.category && data.category.name) {
        categories.add(data.category.name);
      }
    });
    return Array.from(categories);
  };

  const getLocationOptions = () => {
    const locations = new Set();
    job.forEach(data => {
      if (data.state) {
        locations.add(data.state);
      }
    });
    return Array.from(locations);
  };

  const getSpaOptions = () => {
    const spas = new Set();
    job.forEach(data => {
      if (data.spa && data.spa.name) {
        spas.add(data.spa.name);
      }
    });
    return Array.from(spas);
  };

  // Filter jobs based on search and filter criteria
  const filteredJobs = job.filter(data => {
    const matchesSearch = searchTerm === '' || 
      (data.title && data.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.spa && data.spa.name && data.spa.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || 
      (data.category && data.category.name === categoryFilter);
    
    const matchesLocation = locationFilter === 'all' || 
      data.state === locationFilter;
    
    const matchesSpa = spaFilter === 'all' || 
      (data.spa && data.spa.name === spaFilter);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesSpa;
  });

  const handleAddJob = (jobData) => {
    console.log('Adding new spa job:', jobData);
    setShowAddJobForm(false);
  };

  const handleEditJob = (data) => {
    setSelectedJob(data);
    setShowEditJobForm(true);
  };

  const handleUpdateJob = (updatedData) => {
    console.log('Updating job:', updatedData);
    setShowEditJobForm(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = (data) => {
    if (window.confirm(`Are you sure you want to delete ${data.title} position?`)) {
      console.log('Deleting job:', data._id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <button 
          onClick={() => setShowAddJobForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add New Job
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {getCategoryOptions().map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              {getLocationOptions().map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
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

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.map((data, index) => (
              <tr key={data._id || index}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center">
                    {data.title}
                    {data.isNewJob && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{data.category?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{data.spa?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    {data.location || '-'}, {data.state || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{data.salary || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{data.applications || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEditJob(data)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="View">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(data)}
                      className="text-red-600 hover:text-red-900" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Spa Job Form Modal */}
      <AddSpaJobForm 
        isOpen={showAddJobForm} 
        onClose={() => setShowAddJobForm(false)} 
        onSubmit={handleAddJob} 
      />

      {/* Edit Spa Job Form Modal */}
      <EditSpaJobForm 
        isOpen={showEditJobForm} 
        onClose={() => setShowEditJobForm(false)} 
        onSubmit={handleUpdateJob}
        jobData={selectedJob}
      />
    </div>
  );
};

export default Jobs;