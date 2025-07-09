import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
} from '@mui/material';
import {
  Visibility,
  Mouse,
  ShoppingCart,
  Add,
  Edit,
} from '@mui/icons-material';
import { ActivityItem } from '../../types';

interface ActivityListProps {
  activities: ActivityItem[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return <Visibility />;
      case 'click':
        return <Mouse />;
      case 'order':
        return <ShoppingCart />;
      case 'product_added':
        return <Add />;
      case 'product_updated':
        return <Edit />;
      default:
        return <Visibility />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return 'primary.main';
      case 'click':
        return 'secondary.main';
      case 'order':
        return 'success.main';
      case 'product_added':
        return 'info.main';
      case 'product_updated':
        return 'warning.main';
      default:
        return 'grey.500';
    }
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  if (activities.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {activities.slice(0, 5).map((activity) => (
        <ListItem key={activity.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
              {getActivityIcon(activity.type)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={activity.title}
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(activity.timestamp)}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityList;