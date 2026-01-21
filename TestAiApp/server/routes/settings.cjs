const express = require('express');
const { body, validationResult } = require('express-validator');
const { UserSettings } = require('../models/index.cjs');
const authMiddleware = require('../middleware/auth.cjs');

const router = express.Router();

// All routes require authentication (per-user isolation via JWT)
router.use(authMiddleware);

// Get user's settings (filtered by user_id from JWT)
router.get('/', async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      where: { user_id: req.user.id }, // Per-user isolation
    });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user's settings (updates only authenticated user's settings)
router.put(
  '/',
  [
    body('street_address').optional().isString(),
    body('city').optional().isString(),
    body('postal_code').optional().isString(),
    body('country').optional().isString(),
    body('daily_limit').optional().isInt({ min: 0 }),
    body('monthly_limit').optional().isInt({ min: 0 }),
    body('mobile_app_limit').optional().isInt({ min: 0 }),
    body('internet_banking_limit').optional().isInt({ min: 0 }),
    body('atm_limit').optional().isInt({ min: 0 }),
    body('card_enabled').optional().isBoolean(),
    body('contactless_enabled').optional().isBoolean(),
    body('online_payments_enabled').optional().isBoolean(),
    body('international_transactions_enabled').optional().isBoolean(),
    body('email_notifications').optional().isBoolean(),
    body('sms_notifications').optional().isBoolean(),
    body('whatsapp_notifications').optional().isBoolean(),
    body('in_app_notifications').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Find settings for authenticated user only
      const settings = await UserSettings.findOne({
        where: { user_id: req.user.id }, // Per-user isolation
      });

      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      // Update only allowed fields
      const allowedFields = [
        'street_address',
        'city',
        'postal_code',
        'country',
        'daily_limit',
        'monthly_limit',
        'mobile_app_limit',
        'internet_banking_limit',
        'atm_limit',
        'card_enabled',
        'contactless_enabled',
        'online_payments_enabled',
        'international_transactions_enabled',
        'email_notifications',
        'sms_notifications',
        'whatsapp_notifications',
        'in_app_notifications',
      ];

      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // Update settings (only for this user)
      await settings.update(updates);

      res.json({ settings });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }
);

// Initialize settings for a user (if not exists)
router.post('/initialize', async (req, res) => {
  try {
    // Check if settings already exist for this user
    const existingSettings = await UserSettings.findOne({
      where: { user_id: req.user.id }, // Per-user isolation
    });

    if (existingSettings) {
      return res.json({ settings: existingSettings });
    }

    // Create default settings for this user
    const settings = await UserSettings.create({
      user_id: req.user.id,
      country: 'South Africa',
      daily_limit: 500000, // R 5,000.00
      monthly_limit: 5000000, // R 50,000.00
      mobile_app_limit: 300000, // R 3,000.00
      internet_banking_limit: 1000000, // R 10,000.00
      atm_limit: 200000, // R 2,000.00
      card_enabled: true,
      contactless_enabled: true,
      online_payments_enabled: true,
      international_transactions_enabled: false,
      email_notifications: true,
      sms_notifications: true,
      whatsapp_notifications: false,
      in_app_notifications: true,
    });

    res.status(201).json({ settings });
  } catch (error) {
    console.error('Initialize settings error:', error);
    res.status(500).json({ error: 'Failed to initialize settings' });
  }
});

module.exports = router;
