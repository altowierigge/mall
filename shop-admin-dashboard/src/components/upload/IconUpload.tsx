import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoCamera,
} from '@mui/icons-material';
import { useUploadShopIconMutation } from '../../store/api/apiSlice';

interface IconUploadProps {
  currentIcon?: string;
  onIconChange?: (iconUrl: string) => void;
  size?: number;
  disabled?: boolean;
}

const IconUpload: React.FC<IconUploadProps> = ({
  currentIcon,
  onIconChange,
  size = 100,
  disabled = false,
}) => {
  const [uploadIcon, { isLoading }] = useUploadShopIconMutation();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('icon', file);

      const response = await uploadIcon(formData).unwrap();
      
      if (response.success && response.data?.iconUrl) {
        onIconChange?.(response.data.iconUrl);
        setPreview(null);
      }
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to upload icon');
      setPreview(null);
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setPreview(null);
    onIconChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayIcon = preview || currentIcon;

  return (
    <Box display=\"flex\" flexDirection=\"column\" alignItems=\"center\" gap={2}>
      <Box position=\"relative\">
        <Avatar
          src={displayIcon}
          sx={{
            width: size,
            height: size,
            bgcolor: 'grey.300',
            border: '2px dashed',
            borderColor: 'grey.400',
            cursor: disabled ? 'default' : 'pointer',
            '&:hover': {
              borderColor: disabled ? 'grey.400' : 'primary.main',
            },
          }}
          onClick={handleButtonClick}
        >
          {!displayIcon && <PhotoCamera color=\"action\" />}
        </Avatar>
        
        {isLoading && (
          <Box
            position=\"absolute\"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display=\"flex\"
            alignItems=\"center\"
            justifyContent=\"center\"
            bgcolor=\"rgba(255, 255, 255, 0.8)\"
            borderRadius=\"50%\"
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {displayIcon && !disabled && (
          <Tooltip title=\"Remove icon\">
            <IconButton
              size=\"small\"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'error.dark',
                },
              }}
              onClick={handleDelete}
            >
              <Delete fontSize=\"small\" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box textAlign=\"center\">
        <Button
          variant=\"outlined\"
          startIcon={<CloudUpload />}
          onClick={handleButtonClick}
          disabled={disabled || isLoading}
          size=\"small\"
        >
          {displayIcon ? 'Change Icon' : 'Upload Icon'}
        </Button>
        
        <Typography variant=\"caption\" display=\"block\" color=\"text.secondary\" mt={1}>
          Max size: 5MB • PNG, JPG, GIF, WebP
        </Typography>
      </Box>

      {error && (
        <Alert severity=\"error\" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type=\"file\"
        accept=\"image/*\"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default IconUpload;