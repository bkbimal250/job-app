// Dashboard Page Component
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorMessage } from '../../components/common';
import { useDashboardStats, useDailyVisits, useChartData, useRecentActivity } from './hooks';
import {
  DashboardHeader,
  KeyMetricsSection,
  QuickActionsSection,
  SystemStatusSection,
  PerformanceMetrics,
  DailyVisitsChart,
  ChartsSection,
  RecentActivity,
} from './components';

const DashboardPage = () => {
  // Fetch all dashboard data
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    lastUpdated,
    isRefreshing,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    dailyVisits,
    loading: visitsLoading,
    error: visitsError,
  } = useDailyVisits();

  const {
    chartData,
    loading: chartLoading,
    error: chartError,
  } = useChartData();

  const {
    activity,
    loading: activityLoading,
    error: activityError,
  } = useRecentActivity();

  const handleRefresh = () => {
    refetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        {/* Error Message */}
        {statsError && <ErrorMessage message={statsError} />}

        {/* Key Metrics Section */}
        <KeyMetricsSection loading={statsLoading} stats={stats} />

        {/* Quick Actions Section */}
        <QuickActionsSection />

        {/* Performance Metrics */}
        <PerformanceMetrics dailyVisits={dailyVisits} />

        {/* Daily Website Visits Chart */}
        {dailyVisits.length > 0 && (
          <DailyVisitsChart dailyVisits={dailyVisits} />
        )}

        {/* Charts Section */}
        <ChartsSection
          loading={chartLoading}
          chartData={chartData}
          error={chartError}
        />

        {/* Recent Activity Section */}
        <RecentActivity
          loading={activityLoading}
          activity={activity}
          error={activityError}
        />

        {/* System Status Section */}
        <SystemStatusSection
          loading={statsLoading}
          lastUpdated={lastUpdated}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

