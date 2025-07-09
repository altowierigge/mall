import { Response } from 'express';
import { AuthRequest } from '../types/index';
import { TemplateModelDB, CustomizationModelDB } from '../models/database/TemplateModelDB';

export class TemplateController {
  static async getTemplates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, type } = req.query;
      
      let templates;
      
      if (category) {
        templates = await TemplateModelDB.findByCategory(category as any);
      } else if (type === 'premium') {
        templates = await TemplateModelDB.findPremiumTemplates();
      } else if (type === 'free') {
        templates = await TemplateModelDB.findFreeTemplates();
      } else {
        templates = await TemplateModelDB.findAll();
      }

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch templates'
      });
    }
  }

  static async getTemplate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await TemplateModelDB.findById(id);

      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found'
        });
        return;
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('Get template error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch template'
      });
    }
  }

  static async getShopCustomization(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const customization = await CustomizationModelDB.findByShopId(shopOwner.shopId);
      
      if (!customization) {
        res.json({
          success: true,
          data: null
        });
        return;
      }

      // Also fetch the template details
      const template = await TemplateModelDB.findById(customization[0]?.templateId || '');
      
      res.json({
        success: true,
        data: {
          customization,
          template
        }
      });
    } catch (error) {
      console.error('Get shop customization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shop customization'
      });
    }
  }

  static async applyTemplate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { templateId, customizations } = req.body;

      if (!templateId) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required'
        });
        return;
      }

      // Verify template exists
      const template = await TemplateModelDB.findById(templateId);
      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found'
        });
        return;
      }

      // Check if user can access premium templates
      if (template.isPremium) {
        // Here you would check user's subscription status
        // For now, we'll allow all users to access premium templates
      }

      const customization = await CustomizationModelDB.create({
        shopId: shopOwner.shopId,
        templateId,
        customizations: customizations || {},
        isActive: true
      });

      res.json({
        success: true,
        data: {
          customization,
          template,
          message: 'Template applied successfully'
        }
      });
    } catch (error) {
      console.error('Apply template error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply template'
      });
    }
  }

  static async updateCustomization(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { customizations } = req.body;

      if (!customizations) {
        res.status(400).json({
          success: false,
          error: 'Customizations are required'
        });
        return;
      }

      const updatedCustomization = await CustomizationModelDB.update(shopOwner.shopId, {
        customizations,
        updatedAt: new Date()
      });

      if (!updatedCustomization) {
        res.status(404).json({
          success: false,
          error: 'Shop customization not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          customization: updatedCustomization,
          message: 'Customization updated successfully'
        }
      });
    } catch (error) {
      console.error('Update customization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customization'
      });
    }
  }

  static async removeCustomization(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const deleted = await CustomizationModelDB.delete(shopOwner.shopId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Shop customization not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          message: 'Customization removed successfully'
        }
      });
    } catch (error) {
      console.error('Remove customization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove customization'
      });
    }
  }

  static async previewTemplate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { templateId, customizations } = req.body;

      if (!templateId) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required'
        });
        return;
      }

      const template = await TemplateModelDB.findById(templateId);
      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found'
        });
        return;
      }

      // Generate preview data (in real implementation, this would render the template)
      const previewData = {
        templateId,
        template,
        customizations: customizations || {},
        previewUrl: `${req.protocol}://${req.get('host')}/api/v1/templates/preview/${templateId}`,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: previewData
      });
    } catch (error) {
      console.error('Preview template error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate template preview'
      });
    }
  }
}