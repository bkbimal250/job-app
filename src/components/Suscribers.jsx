import React, { useState, useEffect } from "react";
import { getToken } from "../utils/getToken";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Suscribers = () => {
    const [suscribers, setSuscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Email sending form state
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState("");
    const [sendError, setSendError] = useState("");

    // Job selection state
    const [jobs, setJobs] = useState([]);
    const [selectedJobIds, setSelectedJobIds] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState(null);
    const [jobSearch, setJobSearch] = useState("");

    useEffect(() => {
        const fetchSuscribers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/suscribers`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSuscribers(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch subscribers");
                setLoading(false);
            }
        };
        fetchSuscribers();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            setJobsLoading(true);
            try {
                // Fetch all jobs (no pagination/limit)
                const response = await axios.get(`${BASE_URL}/spajobs?all=true`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setJobs(response.data);
                setJobsLoading(false);
            } catch (error) {
                setJobsError("Failed to fetch jobs");
                setJobsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Filter jobs by search
    const filteredJobs = jobs.filter(job => {
        const search = jobSearch.toLowerCase();
        return (
            job.title?.toLowerCase().includes(search) ||
            (typeof job.category === 'string' ? job.category : job.category?.name || '').toLowerCase().includes(search) ||
            (job.location || '').toLowerCase().includes(search) ||
            (job.state || '').toLowerCase().includes(search)
        );
    });

    // Handle email selection
    const handleEmailSelect = (e) => {
        const value = e.target.value;
        setSelectedEmails(prev =>
            prev.includes(value)
                ? prev.filter(email => email !== value)
                : [...prev, value]
        );
    };

    // Handle select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmails(suscribers.map(s => s.email).filter(Boolean));
        } else {
            setSelectedEmails([]);
        }
    };

    // Handle job selection
    const handleJobSelect = (e) => {
        const value = e.target.value;
        setSelectedJobIds(prev =>
            prev.includes(value)
                ? prev.filter(id => id !== value)
                : [...prev, value]
        );
    };

    // Handle select all jobs
    const handleSelectAllJobs = (e) => {
        if (e.target.checked) {
            setSelectedJobIds(jobs.map(j => j._id));
        } else {
            setSelectedJobIds([]);
        }
    };

    // Get selected job objects
    const selectedJobs = jobs.filter(j => selectedJobIds.includes(j._id));

    // Format jobs for email
    const formatJobsForEmail = (jobsArr) => {
        if (!jobsArr.length) return '';
        return '\n\n---\nJob Listings:\n' + jobsArr.map(job =>
            `• ${job.title} (${typeof job.category === 'string' ? job.category : job.category?.name || '-'}), ${job.location || '-'}, ${job.state || '-'}\nSalary: ${job.salary || 'Negotiable'}\nExperience: ${job.experience || 'Any'}\nView: https://spajobs.co.in/job/${job.slug || job._id}`
        ).join('\n\n');
    };

    // Handle send jobs email
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSending(true);
        setSendSuccess("");
        setSendError("");
        try {
            // Send the selected jobs as a jobs array
            const res = await axios.post(
                `${BASE_URL}/send-jobs-email`,
                {
                    emails: selectedEmails,
                    subject: emailSubject,
                    message: emailMessage, // This will be the intro text
                    jobs: selectedJobs,    // <-- Send the jobs array!
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            setSendSuccess(res.data.message || "Jobs sent successfully!");
            setEmailSubject("");
            setEmailMessage("");
            setSelectedEmails([]);
            setSelectedJobIds([]);
        } catch (err) {
            setSendError(
                err.response?.data?.message || "Failed to send jobs email."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-4 md:p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Subscribers & Send Jobs</h2>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Subscribers List */}
                <div className="md:w-1/2 w-full">
                    <h3 className="text-lg font-semibold mb-3">Subscribers List</h3>
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-center">{error}</div>
                    ) : suscribers.length === 0 ? (
                        <div className="text-gray-600 text-center">No subscribers found.</div>
                    ) : (
                        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                            {suscribers.map((suscriber) => (
                                <div key={suscriber._id} className="bg-gray-100 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <h3 className="text-lg font-bold break-all">{suscriber.email || <span className="text-gray-400">No email</span>}</h3>
                                            <p className="text-gray-700">{suscriber.phone || <span className="text-gray-400">No phone</span>}</p>
                                            <p className="text-gray-500 text-sm">Preferred: {suscriber.preferredChannel || 'email'}</p>
                                        </div>
                                        <div className="text-gray-500 text-sm mt-2 sm:mt-0">
                                            {suscriber.createdAt ? new Date(suscriber.createdAt).toLocaleString() : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Right: Email/Jobs Form */}
                <div className="md:w-1/2 w-full">
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold mb-2">Send Jobs to Subscribers</h3>
                        <form onSubmit={handleSendEmail} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 mb-1">Select Subscribers</label>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        checked={selectedEmails.length === suscribers.filter(s => s.email).length && suscribers.length > 0}
                                        onChange={handleSelectAll}
                                        className="mr-2"
                                    />
                                    <label htmlFor="selectAll" className="text-sm">Select All</label>
                                </div>
                                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
                                    {suscribers.filter(s => s.email).map(s => (
                                        <div key={s._id} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                value={s.email}
                                                checked={selectedEmails.includes(s.email)}
                                                onChange={handleEmailSelect}
                                                className="mr-2"
                                            />
                                            <span className="text-sm break-all">{s.email}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Select Jobs to Send</label>
                                {/* Job search box */}
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 mb-2"
                                    placeholder="Search jobs by title, category, or location..."
                                    value={jobSearch}
                                    onChange={e => setJobSearch(e.target.value)}
                                />
                                {jobsLoading ? (
                                    <div className="text-gray-500 text-sm">Loading jobs...</div>
                                ) : jobsError ? (
                                    <div className="text-red-500 text-sm">{jobsError}</div>
                                ) : (
                                    <>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id="selectAllJobs"
                                                checked={selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedJobIds(filteredJobs.map(j => j._id));
                                                    } else {
                                                        setSelectedJobIds([]);
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            <label htmlFor="selectAllJobs" className="text-sm">Select All</label>
                                        </div>
                                        <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                                            {filteredJobs.map(job => (
                                                <div key={job._id} className="flex items-center mb-1">
                                                    <input
                                                        type="checkbox"
                                                        value={job._id}
                                                        checked={selectedJobIds.includes(job._id)}
                                                        onChange={handleJobSelect}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm break-all font-medium">{job.title}</span>
                                                    <span className="ml-2 text-xs text-gray-500">{typeof job.category === 'string' ? job.category : job.category?.name || '-'}</span>
                                                    <span className="ml-2 text-xs text-gray-400">{job.location || '-'}, {job.state || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={emailSubject}
                                    onChange={e => setEmailSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 min-h-[80px]"
                                    value={emailMessage}
                                    onChange={e => setEmailMessage(e.target.value)}
                                    placeholder="Enter your message or job details"
                                    required
                                />
                            </div>
                            {selectedJobs.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                                    <div className="font-semibold mb-1 text-sm text-gray-700">Jobs Preview:</div>
                                    <ul className="list-disc pl-5 text-sm text-gray-700">
                                        {selectedJobs.map(job => (
                                            <li key={job._id}>
                                                <span className="font-medium">{job.title}</span> - {typeof job.category === 'string' ? job.category : job.category?.name || '-'}, {job.location || '-'}, {job.state || '-'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                disabled={sending || selectedEmails.length === 0}
                            >
                                {sending ? "Sending..." : "Send Jobs Email"}
                            </button>
                            {sendSuccess && <div className="text-green-600 text-center mt-2">{sendSuccess}</div>}
                            {sendError && <div className="text-red-600 text-center mt-2">{sendError}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suscribers;
