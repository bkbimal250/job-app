import React, { useState } from 'react';
import { Search, Plus, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';
import AddSpaForm from './AddSpaForm';
import EditSpaForm from './EditSpaForm';

const Spas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSpa, setSelectedSpa] = useState(null);

  const dummySpa = [
    { 
      id: 1, 
      name: 'Royal Spa', 
      address: {
        street: '123 Main St',
        state: 'Maharashtra', 
        city: 'Mumbai', 
        district: 'Mumbai',
        pincode: '400001'
      },
      phone: '555-0123', 
      email: 'royal@example.com',
      logo: 'https://example.com/royal-logo.jpg',
      website: 'https://royalspa.com',
      openingHours: '10:00',
      closingHours: '21:00',
      createdDate: '2024-01-15',
      isActive: true,
      gallery: [
        { url: 'https://example.com/gallery1.jpg', name: 'gallery1.jpg' },
        { url: 'https://example.com/gallery2.jpg', name: 'gallery2.jpg' }
      ]
    },
    { 
      id: 2, 
      name: 'Zen Wellness', 
      address: {
        street: '456 5th Ave',
        state: 'New York', 
        city: 'New York', 
        district: 'Manhattan',
        pincode: '10001'
      },
      phone: '555-0456', 
      createdDate: '2024-02-01',
      isActive: true,
      gallery: []
    },
    { 
      id: 3, 
      name: 'Luxury Haven', 
      address: {
        street: '789 Oak Rd',
        state: 'Texas', 
        city: 'Dallas', 
        district: 'Dallas',
        pincode: '75001'
      },
      phone: '555-0789', 
      createdDate: '2024-03-10',
      isActive: false,
      gallery: []
    },
  ];

  const handleAddSpa = (spaData) => {
    console.log('Adding new spa:', spaData);
    setShowAddForm(false);
  };

  const handleEditSpa = (spa) => {
    setSelectedSpa(spa);
    setShowEditForm(true);
  };

  const handleUpdateSpa = (updatedData) => {
    console.log('Updating spa:', updatedData);
    // Here you would make an API call to update the spa
    setShowEditForm(false);
    setSelectedSpa(null);
  };

  const handleDeleteSpa = (spa) => {
    if (window.confirm(`Are you sure you want to delete ${spa.name}?`)) {
      console.log('Deleting spa:', spa.id);
      // Here you would make an API call to delete the spa
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spa Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add New Spa
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search spas..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="all">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New York">New York</option>
              <option value="Dallas">Dallas</option>
            </select>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummySpa.map((spa) => (
              <tr key={spa.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{spa.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spa.address.state}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spa.address.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spa.address.street}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spa.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spa.createdDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    spa.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {spa.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEditSpa(spa)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSpa(spa)}
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

      {/* Add Spa Form Modal */}
      <AddSpaForm 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)} 
        onSubmit={handleAddSpa} 
      />

      {/* Edit Spa Form Modal */}
      <EditSpaForm 
        isOpen={showEditForm} 
        onClose={() => setShowEditForm(false)} 
        onSubmit={handleUpdateSpa}
        spaData={selectedSpa}
      />
    </div>
  );
};

export default Spas;