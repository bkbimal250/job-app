import React, { useEffect, useState } from "react";
import { ProfilePhotoCard } from '../../components/common';
import userService from '../../api/services/user.service';
import { constructImageUrl } from '../../utils/constructImageUrl';
import { 
  Mail, Phone, User, Calendar, BookOpen, Briefcase, MapPin, Users, 
  Edit, Shield, Award, Star, Sparkles, ArrowLeft, Globe, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserViewPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const profileData = await userService.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getUserInitials = () => {
    if (!profile) return "U";
    const first = profile.firstname?.charAt(0) || "";
    const last = profile.lastname?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const imageUrl = constructImageUrl(profile?.profileimage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl animate-fade-in">
            <div className="flex items-center">
              <Shield className="mr-3 text-red-500" size={20} />
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white transition-colors shadow-sm"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-gray-600">View and manage your profile information</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="btn btn-primary flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Photo Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative mb-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstname + ' ' + profile.lastname)}&background=3b82f6&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Name and Role */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.firstname} {profile.lastname}
                </h2>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="badge badge-primary">Admin</span>
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">150</div>
                    <div className="text-xs text-gray-600">Jobs Posted</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-xs text-gray-600">Applications</div>
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <ProfilePhotoCard />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-500" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">{profile.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-green-500" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{profile.phone || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Users className="text-purple-500" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="font-medium text-gray-900">{profile.gender || 'Not specified'}</div>
                  </div>
                </div>
                
                {profile.dob && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-orange-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-500">Date of Birth</div>
                      <div className="font-medium text-gray-900">
                        {new Date(profile.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Briefcase size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Professional Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.qualification && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="text-indigo-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-500">Qualification</div>
                      <div className="font-medium text-gray-900">{profile.qualification}</div>
                    </div>
                  </div>
                )}
                
                {profile.experience && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Award className="text-yellow-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-500">Experience</div>
                      <div className="font-medium text-gray-900">{profile.experience}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="badge badge-success px-4 py-2 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            {profile.address && (
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="text-red-500" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="font-medium text-gray-900">{profile.address}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <Heart size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2.5+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewPage; 