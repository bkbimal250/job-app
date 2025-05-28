import React, { useEffect, useState } from "react";
import { 
  Building2, Users, Eye, FileText, Briefcase, BarChart2, 
  RefreshCw, Calendar, ArrowUp, ArrowDown, AlertCircle,
  Clock, Layout, PieChart, TrendingUp
} from "lucide-react";
import { getToken } from "../utils/getToken";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ========== Component: StatCard ==========
const StatCard = ({ title, value, icon: Icon, color, change, changeType, isLoading }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition duration-300 hover:shadow-md ${isLoading ? 'animate-pulse' : ''}`}>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded mt-1"></div>
          ) : (
            <h3 className="text-2xl font-bold mt-1 text-gray-800">{value.toLocaleString()}</h3>
          )}

          {!isLoading && change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
              <span>{change}%</span>
              <span className="text-gray-500 ml-1.5">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} transition-transform duration-300 hover:scale-110`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
    {!isLoading && (
      <div className={`h-1 w-full ${color.replace('bg-', 'bg-').replace('500', '400')}`}></div>
    )}
  </div>
);

// ========== Component: ChartSkeleton ==========
const ChartSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} w-full animate-pulse bg-gray-100 rounded-xl`}></div>
);

// ========== Component: SectionHeader ==========
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-4">
    <Icon size={20} className="text-gray-700 mr-2" />
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

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

// ========== Component: KeyMetricsSection ==========
const KeyMetricsSection = ({ loading, stats }) => (
  <section className="mb-8">
    <SectionHeader title="Key Metrics" icon={BarChart2} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {loading
        ? Array(5).fill(0).map((_, index) => (
            <StatCard 
              key={index} 
              title="Loading..." 
              value={0} 
              icon={RefreshCw} 
              color="bg-gray-300" 
              isLoading={true} 
            />
          ))
        : stats.map((stat, index) => <StatCard key={index} {...stat} isLoading={false} />)
      }
    </div>
  </section>
);

// ========== Component: ChartsSection ==========
const ChartsSection = ({ loading }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    {/* User Growth Chart */}
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <SectionHeader title="User Growth" icon={TrendingUp} />
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="h-64 w-full">
          <p className="text-center text-gray-500 h-full flex items-center justify-center">
            [User Growth Chart would be rendered here]
          </p>
        </div>
      )}
    </div>

    {/* Distribution Chart */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <SectionHeader title="User Distribution" icon={PieChart} />
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="h-64 w-full">
          <p className="text-center text-gray-500 h-full flex items-center justify-center">
            [User Distribution Chart would be rendered here]
          </p>
        </div>
      )}
    </div>
  </div>
);

// ========== Component: RecentActivitySection ==========
const RecentActivitySection = ({ loading }) => (
  <section className="mb-8">
    <SectionHeader title="Recent Activity" icon={Calendar} />
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {loading ? (
        <div className="p-6 space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <p className="text-center text-gray-500">
            [Recent activity data would be displayed here]
          </p>
        </div>
      )}
    </div>
  </section>
);

// ========== Component: SystemStatusSection ==========
const SystemStatusSection = ({ loading, lastUpdated, formatLastUpdated }) => (
  <section>
    <SectionHeader title="System Status" icon={Layout} />
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

      // Process and set the statistics data
      setStats([
        {
          title: "Total Spas",
          value: data.totalSpas || 0,
          icon: Building2,
          color: "bg-blue-500",
          change: 12.5,
          changeType: 'increase'
        },
        {
          title: "Total Users",
          value: data.totalUsers || 0,
          icon: Users,
          color: "bg-green-500",
          change: 8.3,
          changeType: 'increase'
        },
        {
          title: "Total Messages",
          value: data.totalMessages || 0,
          icon: Eye,
          color: "bg-purple-500",
          change: 23.7,
          changeType: 'increase'
        },
        {
          title: "Total Applications",
          value: data.totalApplications || 0,
          icon: FileText,
          color: "bg-orange-500",
          change: 20.2,
          changeType: 'increase'
        },
        {
          title: "Total Jobs",
          value: data.totalJobs || 0,
          icon: Briefcase,
          color: "bg-indigo-500",
          change: 15.1,
          changeType: 'increase'
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

  // ===== Effects =====
  useEffect(() => {
    fetchDashboardData();
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

          {/* Charts Section */}
          <ChartsSection loading={loading} />

          {/* Recent Activity Section */}
          <RecentActivitySection loading={loading} />

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