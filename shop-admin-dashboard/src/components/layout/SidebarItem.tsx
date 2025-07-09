import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  text,
  icon,
  path,
  isActive,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;