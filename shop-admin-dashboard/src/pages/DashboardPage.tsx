import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  Mouse,
  ShoppingCart,
  Store,
  AttachMoney,
  People,
  Timeline,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetDashboardStatsQuery, useGetShopAnalyticsQuery } from '../store/api/apiSlice';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityList from '../components/dashboard/ActivityList';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useGetShopAnalyticsQuery({ period: 'weekly' });

  if (statsLoading || analyticsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (statsError || analyticsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load dashboard data. Please refresh the page.
      </Alert>
    );
  }

  const stats = statsData?.data;
  const analytics = analyticsData?.data;

  const chartData = {
    labels: analytics?.chartData.labels || [],
    datasets: [
      {
        label: 'Views',
        data: analytics?.chartData.views || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Clicks',
        data: analytics?.chartData.clicks || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome back! Here's what's happening with your shop.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Views"
            value={stats?.totalViews || 0}
            icon={<Visibility />}
            color="primary"
            growth={stats?.growthMetrics.viewsGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Clicks"
            value={stats?.totalClicks || 0}
            icon={<Mouse />}
            color="secondary"
            growth={stats?.growthMetrics.clicksGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Products"
            value={stats?.totalProducts || 0}
            icon={<Store />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Revenue"
            value={`$${stats?.totalRevenue || 0}`}
            icon={<AttachMoney />}
            color="success"
            growth={stats?.growthMetrics.revenueGrowth}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Performance Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <ActivityList activities={stats?.recentActivity || []} />
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {((stats?.totalClicks || 0) / (stats?.totalViews || 1) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click-through Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">
                    {analytics?.metrics.performance.averageSessionDuration || 0}s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Session Duration
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {analytics?.metrics.products.active || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Products
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {analytics?.metrics.products.featured || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Featured Products
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Timeline />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Bounce Rate"
                  secondary={`${analytics?.metrics.performance.bounceRate || 0}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <ShoppingCart />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Total Orders"
                  secondary={analytics?.metrics.revenue.totalOrders || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <AttachMoney />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Average Order Value"
                  secondary={`$${analytics?.metrics.revenue.averageOrderValue || 0}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;