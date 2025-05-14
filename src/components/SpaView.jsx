import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SpaView = () => {
  const { spaId } = useParams(); // get ID from route
  const [spa, setSpa] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaDetails = async () => {
      try {
        const response = await axios.get(`/api/spas/${spaId}`);
        setSpa(response.data);
      } catch (err) {
        console.error('Error fetching spa details:', err);
        setError("Failed to load spa details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaDetails();
  }, [spaId]);

  if (loading) return <div className="p-6">Loading spa details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!spa) return <div className="p-6">No data found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Spa Details</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {spa.name}</p>
        <p><strong>Location:</strong> {spa.location}</p>
        <p><strong>Phone:</strong> {spa.phone}</p>
        <p><strong>Email:</strong> {spa.email}</p>
        <p><strong>Description:</strong> {spa.description || 'N/A'}</p>
        <p><strong>Status:</strong> {spa.isActive ? "Active" : "Inactive"}</p>
      </div>

      {spa.services && spa.services.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Services Offered</h2>
          <ul className="list-disc list-inside space-y-1">
            {spa.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpaView;
