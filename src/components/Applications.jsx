import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/application/admin/applications',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.status === 200) {
          setApplications(response.data.data);
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Applications</h1>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            const applicant = application.candidate || application.guestInfo;
            return (
              <tr key={application._id}>
                <td>{application.job?.title}</td>
                <td>{applicant?.fullName || applicant?.name}</td>
                <td>{applicant?.phone}</td>
                <td>{applicant?.email}</td>
                <td>
                  {application.resume ? (
                    <a href={application.resume} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  ) : (
                    'No Resume'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
