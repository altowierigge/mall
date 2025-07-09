import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
  growth?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  growth,
}) => {
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'error';
    return 'default';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp />;
    if (growth < 0) return <TrendingDown />;
    return undefined;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {growth !== undefined && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Chip
                  icon={getGrowthIcon(growth)}
                  label={`${growth > 0 ? '+' : ''}${growth}%`}
                  color={getGrowthColor(growth)}
                  size="small"
                />
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;