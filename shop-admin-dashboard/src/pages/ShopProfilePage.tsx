import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore,
  Store,
  Edit,
  Save,
  Cancel,
  Phone,
  Email,
  Language,
  Schedule,
  LocationOn,
  Settings,
  PhotoCamera,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetShopProfileQuery, useUpdateShopProfileMutation } from '../store/api/apiSlice';
import { useAppSelector } from '../hooks/redux';
import { selectUser } from '../store/slices/authSlice';
import IconUpload from '../components/upload/IconUpload';

// Validation schema
const shopProfileSchema = yup.object({
  name: yup.string().required('Shop name is required').min(2, 'Name too short'),
  nameAr: yup.string().required('Arabic name is required'),
  description: yup.string().required('Description is required').max(500, 'Description too long'),
  contact: yup.object({
    phone: yup.string().matches(/^\+966[0-9]{9}$/, 'Invalid Saudi phone number'),
    whatsapp: yup.string().matches(/^\+966[0-9]{9}$/, 'Invalid WhatsApp number'),
    email: yup.string().email('Invalid email format'),
  }),
  websiteUrl: yup.string().url('Invalid website URL'),
  location: yup.object({
    floor: yup.string().required('Floor is required'),
    zone: yup.string().required('Zone is required'),
    unit: yup.string().required('Unit is required'),
  }),
});

interface ShopProfileFormData {
  name: string;
  nameAr: string;
  description: string;
  category: string;
  iconUrl?: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  hours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  location: {
    floor: string;
    zone: string;
    unit: string;
  };
  features: {
    hasOnlineOrdering: boolean;
    hasDelivery: boolean;
    acceptsOnlinePayment: boolean;
  };
  websiteUrl: string;
  isActive: boolean;
}

const ShopProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const { data: profileData, isLoading, error } = useGetShopProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateShopProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ShopProfileFormData>({
    resolver: yupResolver(shopProfileSchema),
    defaultValues: {
      name: '',
      nameAr: '',
      description: '',
      category: '',
      iconUrl: '',
      contact: {
        phone: '',
        whatsapp: '',
        email: '',
      },
      hours: {
        monday: { open: '09:00', close: '22:00', isClosed: false },
        tuesday: { open: '09:00', close: '22:00', isClosed: false },
        wednesday: { open: '09:00', close: '22:00', isClosed: false },
        thursday: { open: '09:00', close: '22:00', isClosed: false },
        friday: { open: '09:00', close: '22:00', isClosed: false },
        saturday: { open: '09:00', close: '22:00', isClosed: false },
        sunday: { open: '09:00', close: '22:00', isClosed: false },
      },
      location: {
        floor: '',
        zone: '',
        unit: '',
      },
      features: {
        hasOnlineOrdering: false,
        hasDelivery: false,
        acceptsOnlinePayment: false,
      },
      websiteUrl: '',
      isActive: true,
    },
  });
  
  const watchData = watch();

  useEffect(() => {
    if (profileData?.data) {
      reset({
        name: profileData.data.name,
        nameAr: profileData.data.nameAr,
        description: profileData.data.description,
        category: profileData.data.category,
        iconUrl: profileData.data.iconUrl || '',
        contact: profileData.data.contact,
        hours: profileData.data.hours,
        location: profileData.data.location,
        features: profileData.data.features,
        websiteUrl: profileData.data.websiteUrl,
        isActive: profileData.data.isActive,
      });
    }
  }, [profileData, reset]);

  const onSubmit = async (data: ShopProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const categories = [
    'Fashion & Clothing',
    'Electronics',
    'Food & Beverages',
    'Beauty & Health',
    'Sports & Fitness',
    'Home & Garden',
    'Books & Media',
    'Jewelry & Accessories',
    'Toys & Games',
    'Other',
  ];

  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load shop profile. Please refresh the page.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Shop Profile
        </Typography>
        <Box>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || isUpdating}
              >
                {isUpdating ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Shop profile updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Store />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Shop Name (English)"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nameAr"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Shop Name (Arabic)"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.nameAr}
                      helperText={errors.nameAr?.message}
                      sx={{ direction: 'rtl' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      disabled={!isEditing}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Shop Icon
                  </Typography>
                  <IconUpload
                    currentIcon={watchData?.iconUrl}
                    onIconChange={(iconUrl) => setValue('iconUrl', iconUrl, { shouldDirty: true })}
                    disabled={!isEditing}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        label="Category"
                        disabled={!isEditing}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="websiteUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Website URL"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.websiteUrl}
                      helperText={errors.websiteUrl?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Contact Information Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Phone />
              <Typography variant="h6">Contact Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="contact.phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.contact?.phone}
                      helperText={errors.contact?.phone?.message}
                      placeholder="+966501234567"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="contact.whatsapp"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="WhatsApp Number"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.contact?.whatsapp}
                      helperText={errors.contact?.whatsapp?.message}
                      placeholder="+966501234567"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="contact.email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.contact?.email}
                      helperText={errors.contact?.email?.message}
                      placeholder="shop@example.com"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Location Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <LocationOn />
              <Typography variant="h6">Location</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="location.floor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Floor"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.location?.floor}
                      helperText={errors.location?.floor?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="location.zone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Zone"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.location?.zone}
                      helperText={errors.location?.zone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="location.unit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unit"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.location?.unit}
                      helperText={errors.location?.unit?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Business Hours Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Schedule />
              <Typography variant="h6">Business Hours</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {dayNames.map((day) => (
                <Grid item xs={12} key={day}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <Typography variant="subtitle1">{day}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Controller
                          name={`hours.${day.toLowerCase()}` as any}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={!value.isClosed}
                                  onChange={(e) =>
                                    onChange({
                                      ...value,
                                      isClosed: !e.target.checked,
                                    })
                                  }
                                  disabled={!isEditing}
                                />
                              }
                              label={value.isClosed ? 'Closed' : 'Open'}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Controller
                          name={`hours.${day.toLowerCase()}` as any}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="time"
                              label="Open Time"
                              value={value.open}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  open: e.target.value,
                                })
                              }
                              disabled={!isEditing || value.isClosed}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Controller
                          name={`hours.${day.toLowerCase()}` as any}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type="time"
                              label="Close Time"
                              value={value.close}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  close: e.target.value,
                                })
                              }
                              disabled={!isEditing || value.isClosed}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Features Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Settings />
              <Typography variant="h6">Features & Settings</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Shop Features
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="features.hasOnlineOrdering"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              disabled={!isEditing}
                            />
                          }
                          label="Online Ordering"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="features.hasDelivery"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              disabled={!isEditing}
                            />
                          }
                          label="Delivery Service"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="features.acceptsOnlinePayment"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              disabled={!isEditing}
                            />
                          }
                          label="Online Payment"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={!isEditing}
                        />
                      }
                      label="Shop Active"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </form>
    </Box>
  );
};

export default ShopProfilePage;