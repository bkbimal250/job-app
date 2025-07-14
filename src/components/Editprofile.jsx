import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL;

const Editprofile = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    qualification: "",
    experience: "",
    skills: [],
    address: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setForm({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "Male",
          dob: data.dob || "",
          qualification: data.qualification || "",
          experience: data.experience || "",
          skills: data.skills || [],
          address: data.address || "",
        });
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (!skillInput.trim() || form.skills.length >= 10) return;
    if (form.skills.includes(skillInput.trim())) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput("");
  };

  const handleSkillRemove = (skill) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token = getToken();
      if (!token) throw new Error("Authentication required");
      const { data } = await axios.put(
        `${BASE_URL}/users/profile`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 text-red-700 p-2 rounded">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-2 rounded">{success}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill, idx) => (
              <span key={idx} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {skill}
                <button type="button" className="ml-1 text-blue-500 hover:text-red-600" onClick={() => handleSkillRemove(skill)}>&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a skill"
              maxLength={20}
              disabled={form.skills.length >= 10}
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={!skillInput.trim() || form.skills.length >= 10}
            >
              +
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">You can only add up to 10 skills.</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Editprofile; 