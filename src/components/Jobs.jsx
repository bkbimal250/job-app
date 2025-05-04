import React, { useState } from 'react';
import { Search, Plus, MapPin, Building2, Pencil, Eye, Trash2 } from 'lucide-react';
import AddSpaJobForm from './AddSpaJobForm';
import EditSpaJobForm from './EditSpaJobForm';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [spaFilter, setSpaFilter] = useState('all');
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [showEditJobForm, setShowEditJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const dummyJobs = [
    { 
      id: 1, 
      title: 'Spa Therapist', 
      category: 'therapist', 
      spa: 'Royal Spa', 
      location: 'Los Angeles',
      city: 'Los Angeles',
      state: 'California', 
      salary: '₹35,000 - ₹60,000',
      description: 'Provide high-quality spa treatments to clients.',
      requirements: 'Certificate in Spa Therapy',
      experience: '2+ years',
      hrWhatsapp: '9123456789',
      hrPhone: '9123456789',
      gender: 'Female',
      isNewJob: true,
      vacancies: 2,
      applications: 12
    },
    { 
      id: 2, 
      title: 'Massage Specialist', 
      category: 'therapist', 
      spa: 'Zen Wellness', 
      location: 'New York',
      city: 'New York',
      state: 'New York',
      salary: '₹50,000 - ₹65,000',
      isNewJob: false,
      vacancies: 1,
      applications: 8
    },
    { 
      id: 3, 
      title: 'Spa Manager', 
      category: 'management', 
      spa: 'Luxury Haven', 
      location: 'Dallas',
      city: 'Dallas',
      state: 'Texas',
      salary: '₹60,000 - ₹75,000',
      isNewJob: false,
      vacancies: 1,
      applications: 25
    },
  ];

  const handleAddJob = (jobData) => {
    console.log('Adding new spa job:', jobData);
    setShowAddJobForm(false);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowEditJobForm(true);
  };

  const handleUpdateJob = (updatedData) => {
    console.log('Updating job:', updatedData);
    setShowEditJobForm(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = (job) => {
    if (window.confirm(`Are you sure you want to delete ${job.title} position?`)) {
      console.log('Deleting job:', job.id);
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
              <option value="therapist">Therapist</option>
              <option value="management">Management</option>
              <option value="receptionist">Receptionist</option>
              <option value="technician">Technician</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="ca">California</option>
              <option value="ny">New York</option>
              <option value="tx">Texas</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={spaFilter}
              onChange={(e) => setSpaFilter(e.target.value)}
            >
              <option value="all">All Spas</option>
              <option value="royal">Royal Spa</option>
              <option value="zen">Zen Wellness</option>
              <option value="luxury">Luxury Haven</option>
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
            {dummyJobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center">
                    {job.title}
                    {job.isNewJob && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{job.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.spa}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    {job.location}, {job.state}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{job.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{job.applications || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEditJob(job)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="View">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job)}
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