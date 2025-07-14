import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        const token = getToken();
        if (!token) return setProfile(prev => ({ ...prev, loading: false }));

        const { data } = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append("profileimage", selectedFile);

      const { data } = await axios.post(`${BASE_URL}/users/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    // Remove /api/v1 if BASE_URL has it
    const urlBase = BASE_URL.replace("/api/v1", "");
    return `${urlBase}${imagePath}`;
  };

  const imageUrl = constructImageUrl(profile.image);

  if (profile.loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              console.error("Image load error for:", imageUrl);
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23888888'%3EImage Error%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-medium shadow-inner">
            {getUserInitials()}
          </div>
        )}
      </div>

      {profile.user && (
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 text-lg">
            {profile.user.firstname} {profile.user.lastname}
          </h3>
          <p className="text-sm text-gray-600">{profile.user.email}</p>
          {profile.user.phone && (
            <p className="text-xs text-gray-500 mt-1">{profile.user.phone}</p>
          )}
        </div>
      )}

      <form onSubmit={handleUpload} className="mt-3">
        {status.error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md mb-3">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="text-green-600 text-sm bg-green-50 p-2 rounded-md mb-3">
            {status.success}
          </div>
        )}

        <div className="mb-3">
          <input
            id="profile-upload"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG, JPEG, PNG (max 5MB)
          </p>
        </div>

        <button
          type="submit"
          disabled={status.loading || !selectedFile}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white 
            ${status.loading || !selectedFile
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {status.loading ? "Uploading..." : "Update Photo"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePhotoCard; 