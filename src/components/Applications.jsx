import React, { useState } from 'react';
import { 
  Search, FileText, Calendar, Download, Eye, 
  CheckCircle, XCircle, MessageSquare, File, Filter 
} from 'lucide-react';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);

  const dummyApplications = [
    { 
      id: 1, 
      applicantName: 'Emma Watson', 
      email: 'emma@example.com',
      phone: '9876543210',
      job: 'Spa Therapist - Royal Spa', 
      status: 'new',
      appliedDate: '2024-05-03',
      appliedTime: '10:30 AM',
      experience: '3 years',
      resumeUrl: '#',
      coverLetter: 'Dear Hiring Manager, I am excited to apply...',
      qualification: 'B.Sc in Cosmetology'
    },
    { 
      id: 2, 
      applicantName: 'John Smith', 
      email: 'john.s@example.com',
      phone: '9876543211',
      job: 'Massage Specialist - Zen Wellness', 
      status: 'reviewing',
      appliedDate: '2024-05-01',
      appliedTime: '2:15 PM',
      experience: '5 years',
      resumeUrl: '#',
      qualification: 'Certificate in Massage Therapy'
    },
    { 
      id: 3, 
      applicantName: 'Lisa Chen', 
      email: 'lisa.c@example.com',
      phone: '9876543212',
      job: 'Spa Manager - Luxury Haven', 
      status: 'interviewed',
      appliedDate: '2024-04-28',
      appliedTime: '9:45 AM',
      experience: '7 years',
      resumeUrl: '#',
      qualification: 'MBA in Hospitality'
    },
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'bg-green-100 text-green-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'interviewed': 'bg-blue-100 text-blue-800',
      'hired': 'bg-purple-100 text-purple-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (applicationId, newStatus) => {
    console.log(`Changing status of application ${applicationId} to ${newStatus}`);
    // API call to update status
  };

  const handleDownloadCSV = () => {
    // Filter applications based on date range
    let filteredData = dummyApplications;
    
    if (startDate || endDate) {
      filteredData = dummyApplications.filter(app => {
        const appDate = new Date(app.appliedDate);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return appDate >= start && appDate <= end;
      });
    }

    // Prepare CSV content
    const headers = ['Applicant Name', 'Email', 'Phone', 'Job', 'Status', 'Applied Date', 
                    'Applied Time', 'Experience', 'Qualification', 'Cover Letter'];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(app => [
        app.applicantName,
        app.email,
        app.phone,
        `"${app.job}"`, // Wrap in quotes for CSV safety
        app.status,
        app.appliedDate,
        app.appliedTime,
        app.experience,
        `"${app.qualification}"`,
        `"${app.coverLetter || ''}"`
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = () => {
    // Download only selected applications
    const selectedData = dummyApplications.filter(app => 
      selectedApplications.includes(app.id)
    );
    
    if (selectedData.length === 0) {
      alert('Please select applications to download');
      return;
    }

    // Same CSV generation logic as above
    const headers = ['Applicant Name', 'Email', 'Phone', 'Job', 'Status', 'Applied Date', 
                    'Applied Time', 'Experience', 'Qualification'];
    
    const csvContent = [
      headers.join(','),
      ...selectedData.map(app => [
        app.applicantName,
        app.email,
        app.phone,
        `"${app.job}"`,
        app.status,
        app.appliedDate,
        app.appliedTime,
        app.experience,
        `"${app.qualification}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === dummyApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(dummyApplications.map(app => app.id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={20} />
            Download Selected
          </button>
          <button 
            onClick={handleDownloadCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Download size={20} />
            Download All
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              <option value="spa-therapist">Spa Therapist</option>
              <option value="massage-specialist">Massage Specialist</option>
              <option value="spa-manager">Spa Manager</option>
            </select>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">
                <input 
                  type="checkbox" 
                  checked={selectedApplications.length === dummyApplications.length}
                  onChange={toggleSelectAll}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyApplications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => toggleSelectApplication(application.id)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{application.applicantName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.job}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.experience}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    {application.appliedDate}
                    <span className="ml-2 text-gray-500">{application.appliedTime}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button 
                      className="text-green-600 hover:text-green-900" 
                      title="View Resume"
                      onClick={() => window.open(application.resumeUrl, '_blank')}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900" 
                      title="Contact"
                    >
                      <MessageSquare size={18} />
                    </button>
                    {application.status !== 'hired' && application.status !== 'rejected' && (
                      <>
                        <button 
                          className="text-green-600 hover:text-green-900" 
                          title="Accept"
                          onClick={() => handleStatusChange(application.id, 'hired')}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900" 
                          title="Reject"
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;