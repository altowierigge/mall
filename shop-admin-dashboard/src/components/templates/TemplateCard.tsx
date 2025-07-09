import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Preview,
  Star,
  CheckCircle,
} from '@mui/icons-material';
import { ShopTemplate } from '../../types/templates';

interface TemplateCardProps {
  template: ShopTemplate;
  isSelected?: boolean;
  onSelect?: (template: ShopTemplate) => void;
  onPreview?: (template: ShopTemplate) => void;
  showActions?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onSelect,
  onPreview,
  showActions = true,
}) => {
  const getCategoryColor = (category: ShopTemplate['category']) => {
    switch (category) {
      case 'modern':
        return 'primary';
      case 'classic':
        return 'secondary';
      case 'minimal':
        return 'default';
      case 'colorful':
        return 'warning';
      case 'premium':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSelect = () => {
    onSelect?.(template);
  };

  const handlePreview = () => {
    onPreview?.(template);
  };

  return (
    <Card
      sx={{
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        cursor: showActions ? 'pointer' : 'default',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': showActions ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
      }}
      onClick={showActions ? handleSelect : undefined}
    >
      {/* Premium badge */}
      {template.isPremium && (
        <Chip
          icon={<Star />}
          label="Premium"
          size="small"
          color="warning"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      {/* Selected indicator */}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        >
          <CheckCircle color="primary" />
        </Box>
      )}

      {/* Template thumbnail */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundImage: `url(${template.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          position: 'relative',
        }}
      >
        {!template.thumbnailUrl && (
          <Typography variant="body2">
            Template Preview
          </Typography>
        )}
        
        {/* Preview overlay */}
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <Tooltip title="Preview Template">
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview();
                }}
                sx={{
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <Preview />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardMedia>

      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" component="h3" noWrap>
            {template.name}
          </Typography>
          <Chip
            label={template.category}
            size="small"
            color={getCategoryColor(template.category)}
            variant="outlined"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {template.description}
        </Typography>

        {/* Template features */}
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Layout: {template.configuration.layout.style} • 
            Colors: {template.configuration.colors.primary} • 
            Font: {template.configuration.fonts.heading.split(',')[0]}
          </Typography>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions>
          <Button
            size="small"
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            fullWidth
          >
            {isSelected ? 'Selected' : 'Select Template'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default TemplateCard;