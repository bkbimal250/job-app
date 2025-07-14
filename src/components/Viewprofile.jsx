import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import ProfilePhotoCard from './ProfilePhotoCard';
import { Mail, Phone, User, Calendar, BookOpen, Briefcase, MapPin, Users } from 'lucide-react';

const BASE_URL =import.meta.env.VITE_API_BASE_URL;

const Viewprofile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) throw new Error("Authentication required");
        const { data } = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-md mx-auto mt-8 bg-red-50 text-red-700 p-4 rounded">{error}</div>;
  }

  if (!profile) return null;

  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const urlBase = BASE_URL.replace("/api/v1", "");
    return `${urlBase}${imagePath}`;
  };

  const imageUrl = constructImageUrl(profile.profileimage);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 flex flex-col md:flex-row gap-8 items-start">
      {/* Profile Photo */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <ProfilePhotoCard />
      </div>
      {/* Profile Details */}
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <User className="text-blue-500" size={28} />
          {profile.firstname} {profile.lastname}
        </h2>
        {imageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23888888'%3EImage Error%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        )}
        <div className="space-y-4 divide-y divide-gray-100">
          <div className="flex items-center gap-3 pt-2">
            <Mail className="text-blue-400" size={18} />
            <span className="text-gray-700 font-medium">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Phone className="text-blue-400" size={18} />
            <span className="text-gray-700 font-medium">{profile.phone}</span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Users className="text-blue-400" size={18} />
            <span className="text-gray-700 font-medium">{profile.gender}</span>
          </div>
          {profile.dob && (
            <div className="flex items-center gap-3 pt-2">
              <Calendar className="text-blue-400" size={18} />
              <span className="text-gray-700 font-medium">
                {new Date(profile.dob).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          {profile.qualification && (
            <div className="flex items-center gap-3 pt-2">
              <BookOpen className="text-blue-400" size={18} />
              <span className="text-gray-700 font-medium">{profile.qualification}</span>
            </div>
          )}
          {profile.experience && (
            <div className="flex items-center gap-3 pt-2">
              <Briefcase className="text-blue-400" size={18} />
              <span className="text-gray-700 font-medium">{profile.experience}</span>
            </div>
          )}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block">
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold mr-2">
                  Skills
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.address && (
            <div className="flex items-center gap-3 pt-2">
              <MapPin className="text-blue-400" size={18} />
              <span className="text-gray-700 font-medium">{profile.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewprofile; 