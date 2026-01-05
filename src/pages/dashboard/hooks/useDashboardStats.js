// Custom Hook for Dashboard Statistics
import { useState, useEffect } from 'react';
import API from '../../../api/config/axios';
import { endpoints } from '../../../api/config/endpoints';

/**
 * Custom hook for fetching dashboard statistics
 * @returns {Object} Dashboard stats state and methods
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [siteStats, setSiteStats] = useState({ totalViews: 0, uniqueVisitors: 0 });

  const fetchStats = async () => {
    setLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      // Fetch dashboard stats
      const statsResponse = await API.get(endpoints.stats.dashboard);
      const data = statsResponse.data || statsResponse;

      // Try to fetch site stats (may not exist, so handle gracefully)
      let siteData = { totalViews: 0, uniqueVisitors: 0 };
      try {
        const siteStatsResponse = await API.get(endpoints.stats.siteStats);
        siteData = siteStatsResponse.data || siteStatsResponse;
      } catch (siteErr) {
        console.warn('Site stats endpoint not available:', siteErr);
      }

      // Format stats array
      const formattedStats = [
        {
          title: "Total Website Visits",
          value: siteData.totalViews || 0,
          icon: 'Eye',
          color: "bg-pink-500",
          change: null,
          changeType: null,
          link: null,
        },
        {
          title: "Unique Website Visitors",
          value: siteData.uniqueVisitors || 0,
          icon: 'Users',
          color: "bg-green-500",
          change: null,
          changeType: null,
          link: null,
        },
        {
          title: "Total Spas",
          value: data.totalSpas || 0,
          icon: 'Building2',
          color: "bg-blue-500",
          change: 12.5,
          changeType: 'increase',
          link: '/spas',
        },
        {
          title: "Total Users",
          value: data.totalUsers || 0,
          icon: 'Users',
          color: "bg-green-500",
          change: 8.3,
          changeType: 'increase',
          link: '/users',
        },
        {
          title: "Total Messages",
          value: data.totalMessages || 0,
          icon: 'Eye',
          color: "bg-purple-500",
          change: 23.7,
          changeType: 'increase',
          link: '/messages',
        },
        {
          title: "Total Applications",
          value: data.totalApplications || 0,
          icon: 'FileText',
          color: "bg-orange-500",
          change: 20.2,
          changeType: 'increase',
          link: '/applications',
        },
        {
          title: "Total Jobs",
          value: data.totalJobs || 0,
          icon: 'Briefcase',
          color: "bg-indigo-500",
          change: 15.1,
          changeType: 'increase',
          link: '/jobs',
        },
        {
          title: "Total Subscribers",
          value: data.totalsuscribers || 0,
          icon: 'Users',
          color: "bg-green-300",
          change: 15.1,
          changeType: 'increase',
          link: '/suscribers',
        },
      ];

      setStats(formattedStats);
      setSiteStats(siteData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load dashboard statistics. Please try again later.");
      setStats([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    lastUpdated,
    isRefreshing,
    siteStats,
    refetch,
    setError,
  };
};

