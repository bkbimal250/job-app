import React, { useContext, useEffect, useState } from "react";
import {
  Search, Plus, User, Mail, Phone, UserPlus, X,
  CheckCircle, AlertCircle, Users, RefreshCw, Shield,
  Trash2, UserCheck, AlertTriangle, Eye, FileText
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { getToken } from "../utils/getToken";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GetAllUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state for adding a new user
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    fullName: "",
    gender: "Male",
    phone: "",
    role: "admin",
    resume:null,
    password: ""
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Auto-generate full name when first or last name changes
  useEffect(() => {
    const { firstname, lastname } = formData;
    if (firstname || lastname) {
      setFormData(prev => ({
        ...prev,
        fullName: `${firstname} ${lastname}`.trim()
      }));
    }
  }, [formData.firstname, formData.lastname]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load users data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // First name validation
    if (!formData.firstname.trim()) {
      errors.firstname = "First name is required";
    }

    // Last name validation
    if (!formData.lastname.trim()) {
      errors.lastname = "Last name is required";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        }
      );

      

      // Reset form and close modal
      setFormData({
        email: "",
        firstname: "",
        lastname: "",
        fullName: "",
        gender: "Male",
        phone: "",
        role: "user",
        password: ""
      });

      setShowAddUserModal(false);
      setSuccessMessage("User has been created successfully!");

      // Refresh user list
      fetchUsers();

    } catch (err) {
      console.error("Error creating user:", err);

      // Handle specific error messages from the API
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.includes("email")) {
          setFormErrors(prev => ({
            ...prev,
            email: err.response.data.message || "This email is already in use"
          }));
        } else {
          setError(err.response.data.message || "Failed to create user");
        }
      } else {
        setError("Failed to create user. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
    setIsDeleting(false);
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!userToDelete || !userToDelete._id) {
      closeDeleteModal();
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await axios.delete(`${BASE_URL}/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      // Remove user from local state
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
      // Show success message
      setSuccessMessage(`User ${userToDelete.fullName || userToDelete.email} has been deleted successfully!`);
      
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting user:", err);
      
      let errorMsg = "Failed to delete user. Please try again.";
      
      // Extract specific error message from API response if available
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      
      setError(errorMsg);
      setIsDeleting(false);
    }
  };

  // Handle resume viewing
  const handleViewResume = (resume) => {
    if (!resume) {
      alert("No resume available for this user.");
      return;
    }
    
    // If resume is a URL, open it in a new tab
    if (typeof resume === 'string' && (resume.startsWith('http') || resume.startsWith('/'))) {
      window.open(resume, '_blank');
    } else {
      // Handle other resume formats or show in modal
      alert("Resume: " + resume);
    }
  };

  // Filter users by name, email, phone, and role
  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch) ||
      user.phone?.toLowerCase().includes(lowerSearch);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'spamanager':
        return 'bg-indigo-100 text-indigo-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-600" />
              Users Management
            </h1>
            <p className="text-gray-500 mt-1">Manage all users in the system</p>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200 shadow-sm"
          >
            <UserPlus className="mr-2" size={20} />
            Add New User
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Success!</h3>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-64">
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="spamanager">Spa Manager</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={30} className="text-blue-500 animate-spin mr-3" />
              <span className="text-gray-600">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                              {user.firstname?.[0] || user.fullName?.[0] || 'U'}
                            </div>
                            {user.fullName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full items-center ${getRoleBadgeColor(user.role)}`}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            {user.gender}
                          </div>
                        </td>


                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition tooltip"
                              title="Delete user"
                              onClick={() => openDeleteModal(user)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Users className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg mb-1">No users found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Showing total count of filtered records */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing all {filteredUsers.length} users
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
                Add New User
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* First Name & Last Name (two columns) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.firstname ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="First name"
                      required
                    />
                    {formErrors.firstname && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.lastname ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="Last name"
                      required
                    />
                    {formErrors.lastname && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastname}</p>
                    )}
                  </div>
                </div>

                {/* Full Name (auto-generated, disabled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
                      placeholder="Auto-generated from first and last name"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This field is auto-generated from first and last name
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="e.g. 9602596759"
                      required
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Gender & Role (two columns) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="spamanager">Spa Manager</option>
                    </select>
                  </div>
                </div>

                {/* {Resume colums} */}

              

              </div>

              {/* Password Field - Only in the Add User Modal Form */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                Delete User
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to delete the user <strong>{userToDelete.fullName || userToDelete.email}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition flex items-center"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllUser;