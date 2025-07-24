import React, { useEffect, useState } from "react";
import { TrendingUp, PieChart as PieIcon, Briefcase, Mail, Globe } from "lucide-react";
import { Line } from "react-chartjs-2";
import SectionHeader from "./SectionHeader";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { getToken } from "../utils/getToken";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ChartSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} w-full animate-pulse bg-gray-100 rounded-xl`}></div>
);

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ChartsSection = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const [userRes, jobRes, msgRes, visitRes] = await Promise.all([
          fetch(`${BASE_URL}/users/chart/monthly`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${BASE_URL}/spajobs/chart/monthly`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${BASE_URL}/messages/chart/monthly`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${BASE_URL}/site/visits/daily`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);
        if (!userRes.ok || !jobRes.ok || !msgRes.ok || !visitRes.ok) throw new Error("Failed to fetch chart data");
        const userJson = await userRes.json();
        const jobJson = await jobRes.json();
        const msgJson = await msgRes.json();
        const visitJson = await visitRes.json();
        setUserData(userJson.data);
        setJobData(jobJson.data);
        setMessageData(msgJson.data);
        setVisitData(visitJson.data);
        setError(null);
      } catch (err) {
        setError("Unable to load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // Helper to convert API data to chart.js format
  const toLineChartData = (data, label, color) => {
    if (!data) return { labels: monthLabels, datasets: [] };
    // Group by year for multi-year support
    const grouped = {};
    data.forEach(({ _id, count }) => {
      const year = _id.year;
      const month = _id.month;
      if (!grouped[year]) grouped[year] = Array(12).fill(0);
      grouped[year][month - 1] = count;
    });
    // If only one year, show just that year; else, show all
    const datasets = Object.entries(grouped).map(([year, counts], idx) => ({
      label: `${label} ${year}`,
      data: counts,
      borderColor: color,
      backgroundColor: color + '33',
      tension: 0.4,
      fill: true,
    }));
    return { labels: monthLabels, datasets };
  };

  // Helper for website visits (last 30 days)
  const toVisitChartData = (data) => {
    if (!data) return { labels: [], datasets: [] };
    const labels = data.map(d => new Date(d.date).toLocaleDateString());
    const views = data.map(d => d.views);
    return {
      labels,
      datasets: [
        {
          label: 'Website Visits',
          data: views,
          borderColor: '#10b981',
          backgroundColor: '#10b98133',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* User Growth Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="User Growth" icon={TrendingUp} />
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line data={toLineChartData(userData, "Users", "#7c3aed")}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>
      {/* Job Growth Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="Job Growth" icon={Briefcase} />
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line data={toLineChartData(jobData, "Jobs", "#6366f1")}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>
      {/* Message Volume Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="Message Volume" icon={Mail} />
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line data={toLineChartData(messageData, "Messages", "#f59e42")}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>
      {/* Website Visits Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="Website Visits (30d)" icon={Globe} />
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line data={toVisitChartData(visitData)}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
  