import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Add,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useUploadProductImagesMutation } from '../../store/api/apiSlice';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}) => {
  const [uploadImages, { isLoading }] = useUploadProductImagesMutation();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      handleUpload(validFiles);
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      setError(null);
      setUploading(true);
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await uploadImages(formData).unwrap();
      
      if (response.success && response.data?.images) {
        const newImages = [...images, ...response.data.images];
        onImagesChange(newImages);
      }
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <Box>
      <Box display=\"flex\" alignItems=\"center\" justifyContent=\"space-between\" mb={2}>
        <Typography variant=\"h6\">
          Product Images
          <Chip
            label={`${images.length}/${maxImages}`}
            size=\"small\"
            sx={{ ml: 1 }}
            color={images.length === maxImages ? 'warning' : 'default'}
          />
        </Typography>
        
        {canAddMore && (
          <Button
            variant=\"outlined\"
            startIcon={uploading ? <CircularProgress size={16} /> : <Add />}
            onClick={handleButtonClick}
            disabled={disabled || uploading}
            size=\"small\"
          >
            Add Images
          </Button>
        )}
      </Box>

      {images.length === 0 ? (
        <Card
          sx={{
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            bgcolor: 'grey.50',
            border: '2px dashed',
            borderColor: 'grey.300',
            cursor: disabled ? 'default' : 'pointer',
            '&:hover': {
              borderColor: disabled ? 'grey.300' : 'primary.main',
            },
          }}
          onClick={handleButtonClick}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant=\"body1\" color=\"text.secondary\" gutterBottom>
            No images uploaded
          </Typography>
          <Typography variant=\"body2\" color=\"text.secondary\">
            Click to upload product images
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardMedia
                  component=\"img\"
                  height=\"120\"
                  image={image}
                  alt={`Product image ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardActions sx={{ p: 1 }}>
                  <Tooltip title=\"Remove image\">
                    <IconButton
                      size=\"small\"
                      color=\"error\"
                      onClick={() => handleRemoveImage(index)}
                      disabled={disabled}
                    >
                      <Delete fontSize=\"small\" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          {canAddMore && (
            <Grid item xs={6} sm={4} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  bgcolor: 'grey.50',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  cursor: disabled ? 'default' : 'pointer',
                  minHeight: 160,
                  '&:hover': {
                    borderColor: disabled ? 'grey.300' : 'primary.main',
                  },
                }}
                onClick={handleButtonClick}
              >
                {uploading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                    <Typography variant=\"body2\" color=\"text.secondary\">
                      Add More
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      <Typography variant=\"caption\" display=\"block\" color=\"text.secondary\" mt={2}>
        Maximum {maxImages} images • Each file max 5MB • PNG, JPG, GIF, WebP
      </Typography>

      {error && (
        <Alert severity=\"error\" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type=\"file\"
        accept=\"image/*\"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default ImageUpload;