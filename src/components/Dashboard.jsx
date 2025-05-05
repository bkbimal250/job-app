import React, { useEffect, useState } from "react";
import { Building2, Users, Eye, FileText, Briefcase } from "lucide-react";
import { getToken } from "../utils/getToken";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/statics/`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        setStats([
          {
            title: "Total Spas",
            value: data.totalSpas || 0,
            icon: Building2,
            color: "bg-blue-500",
          },
          {
            title: "Total Users",
            value: data.totalUsers || 0,
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Total Views",
            value: data.totalViews || 0,
            icon: Eye,
            color: "bg-purple-500",
          },
          {
            title: "Total Applications",
            value: data.totalApplications || 0,
            icon: FileText,
            color: "bg-orange-500",
          },
          {
            title: "Total Jobs",
            value: data.totalJobs || 0,
            icon: Briefcase,
            color: "bg-indigo-500",
          },
        ]);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500 animate-pulse">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
