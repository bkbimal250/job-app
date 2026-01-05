import React, { useState, useEffect } from "react";
import API from "../../api/config/axios";
import { endpoints } from "../../api/config/endpoints";
import { constructImageUrl } from "../../utils/constructImageUrl";
import { Upload, Camera, CheckCircle, AlertCircle, User } from 'lucide-react';

const ProfilePhotoCard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profile, setProfile] = useState({
    user: null,
    image: null,
    loading: true,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await API.get(endpoints.users.profile);

        console.log("User profile data:", data);
        setProfile({
          user: data,
          image: data.profileimage,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(prev => ({ ...prev, loading: false }));
        setStatus({
          loading: false,
          error: "Could not load profile data.",
          success: "",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setStatus({ loading: false, error: "", success: "" });

    if (!file) return setSelectedFile(null);

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setSelectedFile(null);
      setStatus({ error: "Please upload a JPEG, JPG, or PNG image" });
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setStatus({ error: "File size exceeds 5MB limit" });
      e.target.value = null;
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return setStatus({
        loading: false,
        error: "Please select an image to upload",
        success: "",
      });
    }

    try {
      setStatus({ loading: true, error: "", success: "" });

      const formData = new FormData();
      formData.append("profileimage", selectedFile);

      const { data } = await API.post(`${endpoints.users.profile}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", data);

      setProfile(prev => ({ ...prev, image: data.profileimage }));
      setSelectedFile(null);
      setStatus({
        loading: false,
        error: "",
        success: "Profile photo updated successfully!",
      });

      document.getElementById("profile-upload").value = "";

    } catch (error) {
      console.error("Upload error:", error);
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Failed to upload image",
        success: "",
      });
    }
  };

  const getUserInitials = () => {
    const { user } = profile;
    if (!user) return "?";
    const first = user.firstname?.charAt(0) || "";
    const last = user.lastname?.charAt(0) || "";
    return (first + last).toUpperCase() || "?";
  };

  const imageUrl = constructImageUrl(profile.image);

  if (profile.loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Update Photo</h3>
          <p className="text-sm text-gray-600">Upload a new profile picture</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Status Messages */}
          {status.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2 animate-fade-in">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{status.error}</p>
            </div>
          )}

          {status.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2 animate-fade-in">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{status.success}</p>
            </div>
          )}

          {/* File Input */}
          <div className="relative">
            <input
              id="profile-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profile-upload"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="text-blue-500 mb-2 group-hover:text-blue-600 transition-colors" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG (max 5MB)</p>
              </div>
            </label>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={status.loading || !selectedFile}
            className={`w-full btn ${
              status.loading || !selectedFile
                ? 'btn-secondary opacity-50 cursor-not-allowed'
                : 'btn-primary'
            } flex items-center justify-center`}
          >
            {status.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Update Photo
              </>
            )}
          </button>
        </form>
      </div>

      {/* Current Profile Info */}
      {profile.user && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              {profile.user.firstname} {profile.user.lastname}
            </h4>
            <p className="text-xs text-gray-600 mb-2">{profile.user.email}</p>
            {profile.user.phone && (
              <p className="text-xs text-gray-500">{profile.user.phone}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoCard;

