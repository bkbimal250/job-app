# Dashboard Page Structure

This directory contains the Dashboard Management page, organized into modular, reusable components and utilities.

## File Structure

```
dashboard/
├── components/              # React components
│   ├── DashboardHeader.jsx        # Page header with refresh button
│   ├── StatCard.jsx               # Individual stat card component
│   ├── KeyMetricsSection.jsx      # Section displaying key metrics
│   ├── QuickActionsSection.jsx    # Quick action cards
│   ├── SystemStatusSection.jsx    # System status indicators
│   ├── PerformanceMetrics.jsx     # Performance charts (line & bar)
│   ├── DailyVisitsChart.jsx      # Daily visits pie chart and table
│   ├── ChartsSection.jsx          # Growth charts (users, jobs, messages, visits)
│   ├── RecentActivity.jsx         # Recent activity feed
│   └── index.js                   # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── useDashboardStats.js      # Hook for fetching dashboard statistics
│   ├── useDailyVisits.js         # Hook for fetching daily visits
│   ├── useChartData.js           # Hook for fetching chart data
│   ├── useRecentActivity.js      # Hook for fetching recent activity
│   └── index.js                   # Hook exports
│
├── utils/                   # Utility functions
│   ├── chartUtils.js              # Chart data formatting utilities
│   ├── statUtils.js               # Statistics formatting utilities
│   └── index.js                   # Utility exports
│
├── constants.js             # Constants (colors, labels, intervals)
├── DashboardPage.jsx       # Main page component
├── index.js                 # Page export
└── README.md               # This file
```

## Components

### DashboardHeader
- Displays page title and welcome message
- Shows last updated time
- Refresh button to reload data

### StatCard
- Displays individual statistics (value, icon, change percentage)
- Clickable if link is provided
- Loading state support

### KeyMetricsSection
- Grid of stat cards showing key metrics
- Responsive layout (1-4 columns)

### QuickActionsSection
- Quick action cards for common tasks
- Navigation to different sections

### SystemStatusSection
- System status indicators (API, Database, Server)
- Operational status display

### PerformanceMetrics
- Weekly website visits line chart
- Monthly distribution bar chart

### DailyVisitsChart
- Pie chart for daily visits (last 30 days)
- Table showing visit details

### ChartsSection
- User Growth chart
- Job Growth chart
- Message Volume chart
- Website Visits chart (30 days)

### RecentActivity
- Recent jobs
- Recent applications
- Recent messages
- Recent registrations
- Recent logins

## Hooks

### useDashboardStats
- Fetches dashboard statistics from API
- Handles loading and error states
- Provides refetch function
- Formats stats for display

### useDailyVisits
- Fetches daily website visits data
- Handles loading and error states

### useChartData
- Fetches chart data (users, jobs, messages, visits)
- Handles loading and error states

### useRecentActivity
- Fetches recent activity data
- Handles loading and error states

## Utils

### chartUtils
- `toLineChartData()` - Convert API data to Chart.js line chart format
- `toVisitChartData()` - Convert visit data to chart format
- `formatChartDate()` - Format dates for chart display

### statUtils
- `formatStatValue()` - Format stat values for display
- `calculateChange()` - Calculate percentage change
- `formatLastUpdated()` - Format last updated time

## Constants

- `CHART_COLORS` - Color palette for charts
- `PIE_CHART_COLORS` - Colors for pie chart segments
- `MONTH_LABELS` - Month abbreviations
- `REFRESH_INTERVAL` - Auto-refresh interval (5 minutes)

## Usage

The main `DashboardPage` component:
1. Uses multiple hooks to fetch different data
2. Renders components in a clean, organized layout
3. Handles loading and error states
4. Provides refresh functionality

## Features

- **Real-time Statistics**: Display key metrics with change indicators
- **Performance Charts**: Visual representation of growth trends
- **Daily Visits**: Track website visits with pie chart and table
- **Recent Activity**: Monitor recent system activity
- **Quick Actions**: Fast navigation to common tasks
- **System Status**: Monitor system health
- **Responsive Design**: Works on all screen sizes
- **Auto-refresh**: Optional auto-refresh functionality

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easy to find and update specific functionality
4. **Testability**: Each component/hook can be tested independently
5. **Scalability**: Easy to add new metrics or charts

