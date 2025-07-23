import React, { useEffect, useState } from "react";
import { 
  Building2, Users, Eye, FileText, Briefcase, BarChart2, 
  RefreshCw, Calendar, ArrowUp, ArrowDown, AlertCircle,
  Clock, Layout, PieChart, TrendingUp
} from "lucide-react";
import { getToken } from "../utils/getToken";
import KeyMetricsSection from "./KeyMetricsSection";
import ChartsSection from "./ChartsSection";
import RecentActivity from "./RecentActivity";
import { PieChart as PieChartRecharts, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ========== Component: SystemStatusCard ==========
const SystemStatusCard = ({ title, status, lastChecked }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">{title}</span>
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{status}</span>
    </div>
    <p className="text-xs text-gray-500">Last checked: {lastChecked}</p>
  </div>
);

// ========== Component: ErrorMessage ==========
const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
    <div className="flex items-start">
      <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </div>
  </div>
);

// ========== Component: DashboardHeader ==========
const DashboardHeader = ({ lastUpdated, isRefreshing, handleRefresh, formatLastUpdated }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="text-violet-200 mt-1">
        Overview of your system statistics and performance
      </p>
    </div>
    <div className="mt-4 sm:mt-0 flex items-center">
      {lastUpdated && (
        <div className="text-sm text-white flex items-center mr-4">
          <Clock size={14} className="mr-1" />
          Last updated: {formatLastUpdated(lastUpdated)}
        </div>
      )}
      <button 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        className={`px-4 py-2 rounded-lg flex items-center text-white ${
          isRefreshing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      >
        <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  </div>
);

// ========== Component: SystemStatusSection ==========
const SystemStatusSection = ({ loading, lastUpdated, formatLastUpdated }) => (
  <section>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-green-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SystemStatusCard 
            title="API Status" 
            status="Operational" 
            lastChecked={formatLastUpdated(lastUpdated)} 
          />
          <SystemStatusCard 
            title="Database Status" 
            status="Operational" 
            lastChecked={formatLastUpdated(lastUpdated)} 
          />
          <SystemStatusCard 
            title="Server Status" 
            status="Operational" 
            lastChecked={formatLastUpdated(lastUpdated)} 
          />
        </div>
      )}
    </div>
  </section>
);

// ========== Main Dashboard Component ==========
const Dashboard = () => {
  // ===== State Management =====
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [siteStats, setSiteStats] = useState({ total: 0, unique: 0 });
  const [dailyVisits, setDailyVisits] = useState([]);

  // ===== Data Fetching =====
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);

      const res = await fetch(
        `${BASE_URL}/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();

      setStats([
        {
          title: "Total Website Visits",
          value: siteStats.total,
          icon: Eye,
          color: "bg-pink-500",
          change: null,
          changeType: null,
          link: null,
        },
        {
          title: "Unique Website Visitors",
          value: siteStats.unique,
          icon: Users,
          color: "bg-green-500",
          change: null,
          changeType: null,
          link: null,
        },
        {
          title: "Total Spas",
          value: data.totalSpas || 0,
          icon: Building2,
          color: "bg-blue-500",
          change: 12.5,
          changeType: 'increase',
          link: '/spas',
        },
        {
          title: "Total Users",
          value: data.totalUsers || 0,
          icon: Users,
          color: "bg-green-500",
          change: 8.3,
          changeType: 'increase',
          link: '/users',
        },
        {
          title: "Total Messages",
          value: data.totalMessages || 0,
          icon: Eye,
          color: "bg-purple-500",
          change: 23.7,
          changeType: 'increase',
          link: '/messages',
        },
        {
          title: "Total Applications",
          value: data.totalApplications || 0,
          icon: FileText,
          color: "bg-orange-500",
          change: 20.2,
          changeType: 'increase',
          link: '/applications',
        },
        {
          title: "Total Jobs",
          value: data.totalJobs || 0,
          icon: Briefcase,
          color: "bg-indigo-500",
          change: 15.1,
          changeType: 'increase',
          link: '/jobs',
        },
      ]);

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load dashboard statistics. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchDailyVisits = async () => {
    try {
      const res = await fetch(`${BASE_URL}/site/visits/daily`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDailyVisits(data.data || []);
      }
    } catch (err) {
      setDailyVisits([]);
    }
  };

  const fetchSiteStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/site/stats`);
      if (res.ok) {
        const data = await res.json();
        setSiteStats({
          total: data.totalViews || 0,
          unique: data.uniqueVisitors || 0,
        });
      }
    } catch {
      setSiteStats({ total: 0, unique: 0 });
    }
  };

  // ===== Effects =====
  useEffect(() => {
    fetchDashboardData();
    fetchDailyVisits();
    fetchSiteStats();
  }, []);

  // ===== Event Handlers =====
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // ===== Utility Functions =====
  const formatLastUpdated = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Color palette for pie chart
  const PIE_COLORS = [
    '#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#d8854f', '#d0ed57', '#a28fd0',
    '#f7b267', '#f4845f', '#f27059', '#4f98ca', '#3da5d9', '#62c370', '#b2f7ef', '#f6dfeb', '#f7b7a3', '#ea5f89',
    '#b8b3e9', '#f7c59f', '#ef6f6c', '#465775', '#56e39f', '#59c3c3', '#52489c', '#ebebeb', '#cad2c5', '#84a98c', '#52796f'
  ];

  // ===== Render =====
  return (
    <div className="bg-violet-500 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <DashboardHeader 
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
          formatLastUpdated={formatLastUpdated}
        />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Main Content Sections */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {/* Key Metrics Section */}
          <KeyMetricsSection loading={loading} stats={stats} />

          {/* Daily Website Visits Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">Daily Website Visits (Pie Chart, Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChartRecharts>
                <Pie
                  data={dailyVisits}
                  dataKey="views"
                  nameKey="date"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, views }) => views > 0 ? views : ''}
                >
                  {dailyVisits.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} visits`, 'Visits']} labelFormatter={label => {
                  const entry = dailyVisits.find(d => new Date(d.date).toLocaleDateString() === label);
                  return entry ? new Date(entry.date).toLocaleDateString() : label;
                }} />
                <Legend />
              </PieChartRecharts>
            </ResponsiveContainer>
          </div>

          {/* Daily Website Visits Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">Daily Website Visits (Last 30 Days)</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Visits</th>
                </tr>
              </thead>
              <tbody>
                {dailyVisits.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-1">{item.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Section */}
          <ChartsSection loading={loading} />

          {/* Recent Activity Section */}
          <RecentActivity loading={loading} />

          {/* System Status Section */}
          <SystemStatusSection 
            loading={loading} 
            lastUpdated={lastUpdated} 
            formatLastUpdated={formatLastUpdated} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;