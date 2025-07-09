import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  Brush,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { useGetTemplatesQuery, useGetShopCustomizationQuery, useApplyTemplateMutation, useUpdateCustomizationMutation, usePreviewTemplateMutation } from '../store/api/apiSlice';
import { ShopTemplate, ShopCustomization, TemplatePreview } from '../types/templates';
import TemplateCard from '../components/templates/TemplateCard';
import TemplateCustomizer from '../components/templates/TemplateCustomizer';

const TemplatesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ShopTemplate | null>(null);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<TemplatePreview | null>(null);

  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useGetTemplatesQuery({});
  const { data: customizationData, isLoading: customizationLoading } = useGetShopCustomizationQuery();
  const [applyTemplate, { isLoading: applyingTemplate }] = useApplyTemplateMutation();
  const [updateCustomization, { isLoading: updatingCustomization }] = useUpdateCustomizationMutation();
  const [previewTemplate, { isLoading: previewingTemplate }] = usePreviewTemplateMutation();

  const templates = templatesData?.data || [];
  const currentCustomization = customizationData?.data?.customization;
  const currentTemplate = customizationData?.data?.template;

  const categories = ['all', 'modern', 'classic', 'minimal', 'colorful', 'premium'];
  const tabLabels = ['All', 'Modern', 'Classic', 'Minimal', 'Colorful', 'Premium'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedTab === 0 || template.category === categories[selectedTab];
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleTemplateSelect = (template: ShopTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApplyTemplate = async (template: ShopTemplate) => {
    try {
      await applyTemplate({
        templateId: template.id,
        customizations: {}
      }).unwrap();
      
      setSelectedTemplate(null);
      // Show success message
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const handleCustomizeTemplate = (template: ShopTemplate) => {
    setSelectedTemplate(template);
    setCustomizeDialogOpen(true);
  };

  const handleSaveCustomizations = async (customizations: ShopCustomization['customizations']) => {
    if (!selectedTemplate) return;

    try {
      if (currentCustomization) {
        await updateCustomization({ customizations }).unwrap();
      } else {
        await applyTemplate({
          templateId: selectedTemplate.id,
          customizations
        }).unwrap();
      }
      
      setCustomizeDialogOpen(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save customizations:', error);
    }
  };

  const handlePreviewTemplate = async (template: ShopTemplate, customizations?: ShopCustomization['customizations']) => {
    try {
      const result = await previewTemplate({
        templateId: template.id,
        customizations: customizations || {}
      }).unwrap();
      
      setPreviewData(result.data);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Failed to preview template:', error);
    }
  };

  const handlePreviewCustomizations = (customizations: ShopCustomization['customizations']) => {
    if (selectedTemplate) {
      handlePreviewTemplate(selectedTemplate, customizations);
    }
  };

  if (templatesLoading || customizationLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (templatesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load templates. Please refresh the page.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Shop Templates
        </Typography>
        {currentTemplate && (
          <Button
            variant="outlined"
            startIcon={<Brush />}
            onClick={() => handleCustomizeTemplate(currentTemplate)}
          >
            Customize Current
          </Button>
        )}
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Choose a template to customize your shop's mobile appearance. Premium templates unlock advanced features.
      </Typography>

      {/* Current Template Status */}
      {currentTemplate && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircle color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Current Template: {currentTemplate.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTemplate.description}
              </Typography>
            </Box>
            <Box ml="auto">
              <Chip
                label={currentTemplate.category}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
              />
              {currentTemplate.isPremium && (
                <Chip
                  icon={<Star />}
                  label="Premium"
                  size="small"
                  color="warning"
                />
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Search and Filter */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {}}
        >
          Filter
        </Button>
      </Box>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              icon={index === 5 ? <Star /> : undefined}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <TemplateCard
              template={template}
              isSelected={currentTemplate?.id === template.id}
              onSelect={handleTemplateSelect}
              onPreview={handlePreviewTemplate}
            />
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={!!selectedTemplate && !customizeDialogOpen} onClose={() => setSelectedTemplate(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Apply Template: {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedTemplate?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This will replace your current template. You can customize it after applying.
          </Typography>
          {selectedTemplate?.isPremium && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This is a premium template with advanced features.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTemplate(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedTemplate && handleCustomizeTemplate(selectedTemplate)}
            startIcon={<Brush />}
          >
            Customize
          </Button>
          <Button
            variant="contained"
            onClick={() => selectedTemplate && handleApplyTemplate(selectedTemplate)}
            disabled={applyingTemplate}
          >
            {applyingTemplate ? <CircularProgress size={20} /> : 'Apply Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customization Dialog */}
      <Dialog open={customizeDialogOpen} onClose={() => setCustomizeDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Customize Template
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <TemplateCustomizer
              template={selectedTemplate}
              currentCustomization={currentCustomization}
              onSave={handleSaveCustomizations}
              onPreview={handlePreviewCustomizations}
              isLoading={updatingCustomization || applyingTemplate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Template Preview
        </DialogTitle>
        <DialogContent>
          {previewData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {previewData.template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {previewData.template.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Template Preview
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatesPage;