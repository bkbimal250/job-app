import React, { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, DollarSign, Users, Phone, MessageSquare, GraduationCap, Building2 } from 'lucide-react';

const EditSpaJobForm = ({ isOpen, onClose, onSubmit, jobData }) => {
  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    location: '',
    city: '',
    state: '',
    category: '',
    experience: '',
    description: '',
    hrWhatsapp: '',
    hrPhone: '',
    gender: 'Any',
    isNewJob: true,
    vacancies: 1,
    requirements: '',
    spa: ''
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSpaDropdown, setShowSpaDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [spaSearch, setSpaSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Mock data for dropdowns
  const categories = [
    { id: '1', name: 'Spa Therapist' },
    { id: '2', name: 'Massage Therapist' },
    { id: '3', name: 'Spa Manager' },
    { id: '4', name: 'Receptionist' },
    { id: '5', name: 'Beauty Therapist' },
    { id: '6', name: 'Wellness Consultant' },
    { id: '7', name: 'Ayurvedic Therapist' },
  ];

  const spas = [
    { id: '1', name: 'Royal Spa' },
    { id: '2', name: 'Zen Wellness' },
    { id: '3', name: 'Luxury Haven' },
    { id: '4', name: 'Serenity Spa Mumbai' },
    { id: '5', name: 'Wellness Paradise' },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const genderOptions = ['Any', 'Male', 'Female', 'Non-binary'];

  useEffect(() => {
    if (jobData) {
      setFormData(jobData);
      
      // Set search fields with current values
      const selectedCategory = categories.find(cat => cat.id === jobData.category);
      if (selectedCategory) {
        setCategorySearch(selectedCategory.name);
      }
      
      const selectedSpa = spas.find(spa => spa.id === jobData.spa);
      if (selectedSpa) {
        setSpaSearch(selectedSpa.name);
      }
      
      setStateSearch(jobData.state || '');
      setSelectedState(jobData.state || '');
    }
  }, [jobData]);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSpas = spas.filter(spa => 
    spa.name.toLowerCase().includes(spaSearch.toLowerCase())
  );

  const filteredStates = indianStates.filter(state => 
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : 
               type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category: category.id }));
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const handleSpaSelect = (spa) => {
    setFormData(prev => ({ ...prev, spa: spa.id }));
    setSpaSearch(spa.name);
    setShowSpaDropdown(false);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setStateSearch(state);
    setFormData(prev => ({ ...prev, state: state }));
    setShowStateDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Spa Job</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spa Manager"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                  }}
                  onFocus={() => setShowCategoryDropdown(true)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search category"
                />
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      >
                        <Briefcase size={16} className="mr-2 text-gray-400" />
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spa*
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={spaSearch}
                  onChange={(e) => {
                    setSpaSearch(e.target.value);
                    setShowSpaDropdown(true);
                  }}
                  onFocus={() => setShowSpaDropdown(true)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search spa"
                />
                {showSpaDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredSpas.map((spa) => (
                      <div
                        key={spa.id}
                        onClick={() => handleSpaSelect(spa)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      >
                        <Building2 size={16} className="mr-2 text-gray-400" />
                        {spa.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range*
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ₹35,000 - ₹50,000"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Banjara Hills"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Hyderabad"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State*
              </label>
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => {
                  setStateSearch(e.target.value);
                  setShowStateDropdown(true);
                }}
                onFocus={() => setShowStateDropdown(true)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search state"
              />
              {showStateDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredStates.map((state, index) => (
                    <div
                      key={index}
                      onClick={() => handleStateSelect(state)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Required*
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3+ years"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the job role, responsibilities, and requirements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements*
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Bachelor's Degree + Spa Experience"
            />
          </div>

          {/* HR Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HR WhatsApp*
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="hrWhatsapp"
                  value={formData.hrWhatsapp}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit WhatsApp number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HR Phone*
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="hrPhone"
                  value={formData.hrPhone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender Preference
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {genderOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Vacancies*
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>

          {/* New Job Indicator */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isNewJob"
                checked={formData.isNewJob}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Mark as New Job
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpaJobForm;