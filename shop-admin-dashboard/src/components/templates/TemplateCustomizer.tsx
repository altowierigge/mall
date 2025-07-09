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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  Palette,
  TextFormat,
  ViewModule,
  Visibility,
  Branding,
  Save,
  Refresh,
} from '@mui/icons-material';
import { ShopTemplate, ShopCustomization } from '../../types/templates';

interface TemplateCustomizerProps {
  template: ShopTemplate;
  currentCustomization?: ShopCustomization;
  onSave: (customizations: ShopCustomization['customizations']) => void;
  onPreview: (customizations: ShopCustomization['customizations']) => void;
  isLoading?: boolean;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  currentCustomization,
  onSave,
  onPreview,
  isLoading = false,
}) => {
  const [customizations, setCustomizations] = useState<ShopCustomization['customizations']>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (currentCustomization) {
      setCustomizations(currentCustomization.customizations);
    } else {
      setCustomizations({});
    }
    setHasChanges(false);
  }, [currentCustomization]);

  const handleColorChange = (colorType: keyof ShopTemplate['configuration']['colors'], value: string) => {
    setCustomizations(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleFontChange = (fontType: keyof ShopTemplate['configuration']['fonts'], value: string) => {
    setCustomizations(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleLayoutChange = (layoutType: keyof ShopTemplate['configuration']['layout'], value: any) => {
    setCustomizations(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [layoutType]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleComponentToggle = (component: keyof ShopTemplate['configuration']['components'], value: boolean) => {
    setCustomizations(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [component]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleBrandingChange = (brandingType: keyof ShopTemplate['configuration']['branding'], value: any) => {
    setCustomizations(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [brandingType]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(customizations);
    setHasChanges(false);
  };

  const handlePreview = () => {
    onPreview(customizations);
  };

  const handleReset = () => {
    setCustomizations({});
    setHasChanges(true);
  };

  const getEffectiveValue = (section: keyof ShopTemplate['configuration'], key: string) => {
    const customValue = customizations[section]?.[key as keyof any];
    return customValue !== undefined ? customValue : template.configuration[section][key as keyof any];
  };

  const fontOptions = [
    'Inter, sans-serif',
    'Helvetica, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Playfair Display, serif',
    'Poppins, sans-serif',
    'Roboto, sans-serif',
    'Source Sans Pro, sans-serif',
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Customize {template.name}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<Refresh />}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={handlePreview}
            startIcon={<Visibility />}
            disabled={isLoading}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            disabled={isLoading || !hasChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have unsaved changes. Click "Save Changes" to apply them.
        </Alert>
      )}

      {/* Colors Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Palette />
            <Typography variant="h6">Colors</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {Object.entries(template.configuration.colors).map(([colorType, defaultValue]) => (
              <Grid item xs={12} sm={6} md={4} key={colorType}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                    {colorType.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: getEffectiveValue('colors', colorType),
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <TextField
                      size="small"
                      value={getEffectiveValue('colors', colorType)}
                      onChange={(e) => handleColorChange(colorType as any, e.target.value)}
                      placeholder={defaultValue}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Fonts Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <TextFormat />
            <Typography variant="h6">Typography</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Heading Font</InputLabel>
                <Select
                  value={getEffectiveValue('fonts', 'heading')}
                  label="Heading Font"
                  onChange={(e) => handleFontChange('heading', e.target.value)}
                >
                  {fontOptions.map(font => (
                    <MenuItem key={font} value={font}>
                      <span style={{ fontFamily: font.split(',')[0] }}>
                        {font.split(',')[0]}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Body Font</InputLabel>
                <Select
                  value={getEffectiveValue('fonts', 'body')}
                  label="Body Font"
                  onChange={(e) => handleFontChange('body', e.target.value)}
                >
                  {fontOptions.map(font => (
                    <MenuItem key={font} value={font}>
                      <span style={{ fontFamily: font.split(',')[0] }}>
                        {font.split(',')[0]}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Layout Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <ViewModule />
            <Typography variant="h6">Layout</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Layout Style</InputLabel>
                <Select
                  value={getEffectiveValue('layout', 'style')}
                  label="Layout Style"
                  onChange={(e) => handleLayoutChange('style', e.target.value)}
                >
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="list">List</MenuItem>
                  <MenuItem value="carousel">Carousel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Columns</InputLabel>
                <Select
                  value={getEffectiveValue('layout', 'columns')}
                  label="Columns"
                  onChange={(e) => handleLayoutChange('columns', e.target.value)}
                >
                  <MenuItem value={1}>1 Column</MenuItem>
                  <MenuItem value={2}>2 Columns</MenuItem>
                  <MenuItem value={3}>3 Columns</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Spacing</InputLabel>
                <Select
                  value={getEffectiveValue('layout', 'spacing')}
                  label="Spacing"
                  onChange={(e) => handleLayoutChange('spacing', e.target.value)}
                >
                  <MenuItem value="compact">Compact</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="spacious">Spacious</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Components Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Visibility />
            <Typography variant="h6">Components</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(template.configuration.components).map(([component, defaultValue]) => (
              <Grid item xs={12} sm={6} md={4} key={component}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={getEffectiveValue('components', component)}
                      onChange={(e) => handleComponentToggle(component as any, e.target.checked)}
                    />
                  }
                  label={component.replace(/([A-Z])/g, ' $1').replace(/^show/, 'Show ').trim()}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Branding Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Branding />
            <Typography variant="h6">Branding</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getEffectiveValue('branding', 'showLogo')}
                    onChange={(e) => handleBrandingChange('showLogo', e.target.checked)}
                  />
                }
                label="Show Logo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getEffectiveValue('branding', 'showSlogan')}
                    onChange={(e) => handleBrandingChange('showSlogan', e.target.checked)}
                  />
                }
                label="Show Slogan"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Logo Position</InputLabel>
                <Select
                  value={getEffectiveValue('branding', 'logoPosition')}
                  label="Logo Position"
                  onChange={(e) => handleBrandingChange('logoPosition', e.target.value)}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TemplateCustomizer;