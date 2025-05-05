import React, { useState, useEffect } from "react";
import { Search, Plus, Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import AddSpaForm from "./AddSpaForm";
import EditSpaForm from "./EditSpaForm";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

import { getToken } from "../utils/getToken";

const Spas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSpa, setSelectedSpa] = useState(null);
  const [spa, setSpas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/spas`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setSpas(response.data);
        setError("");

      } catch (err) {
        console.error(" Fetch error: ", err);
        setError("Unable to load spas data.");
      }
    };

    fetchSpas();

  },[]);

  // Extract unique values for filters
  const getStateOptions = () => {
    const states = new Set();
    spa.forEach(data => {
      if (data.address && data.address.state) {
        states.add(data.address.state);
      }
    });
    return Array.from(states);
  };

  const getCityOptions = () => {
    const cities = new Set();
    spa.forEach(data => {
      if (data.address && data.address.city) {
        cities.add(data.address.city);
      }
    });
    return Array.from(cities);
  };

  // Filter spas based on search and filter criteria
  const filteredSpas = spa.filter(data => {
    const matchesSearch = searchTerm === '' || 
      (data.name && data.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.address && data.address.street && data.address.street.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesState = stateFilter === 'all' || 
      (data.address && data.address.state === stateFilter);
    
    const matchesCity = cityFilter === 'all' || 
      (data.address && data.address.city === cityFilter);
    
    const matchesDate = dateFilter === '' || 
      (data.createdAt && data.createdAt.startsWith(dateFilter));
    
    return matchesSearch && matchesState && matchesCity && matchesDate;
  });

  const handleAddSpa = (spaData) => {
    console.log("Adding new spa:", spaData);
    setShowAddForm(false);
  };

  const handleEditSpa = (data) => {
    setSelectedSpa(data);
    setShowEditForm(true);
  };

  const handleUpdateSpa = (updatedData) => {
    console.log("Updating spa:", updatedData);
    setShowEditForm(false);
    setSelectedSpa(null);
  };

  const handleDeleteSpa = (data) => {
    if (window.confirm(`Are you sure you want to delete ${data.name}?`)) {
      console.log("Deleting spa:", data._id);
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
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
              {getStateOptions().map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              {getCityOptions().map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
            

            <div className="relative">
              <Calendar
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added by 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSpas.map((data , index) => (
              <tr key={data._id || index}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {data.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.address?.state || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.address?.city || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.address?.street || '-'}-{data.address?.pincode || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{data.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.createdBy?.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      data.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEditSpa(data)}
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
                      onClick={() => handleDeleteSpa(data)}
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