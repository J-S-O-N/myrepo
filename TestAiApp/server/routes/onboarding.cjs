const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');
const UserSettings = require('../models/UserSettings.cjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.cjs');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, authConfig.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// GET /api/onboarding/status - Check onboarding status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      onboarding_completed: user.onboarding_completed,
      onboarding_step: user.onboarding_step,
      account_status: user.account_status,
      profile: {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        date_of_birth: user.date_of_birth,
        profile_picture_url: user.profile_picture_url,
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/onboarding/step1 - Personal Information
router.post('/step1', authenticateToken, async (req, res) => {
  try {
    const { username, first_name, last_name, phone_number, date_of_birth } = req.body;

    // Validate required fields
    if (!username || !first_name || !last_name) {
      return res.status(400).json({ error: 'Username, first name, and last name are required' });
    }

    // Check if username is already taken
    const existingUser = await User.findByUsername(username);
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(username)) {
      return res.status(400).json({ 
        error: 'Username must be 3-50 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }

    // Update user
    const user = await User.findByPk(req.user.id);
    await user.update({
      username,
      first_name,
      last_name,
      phone_number: phone_number || null,
      date_of_birth: date_of_birth || null,
      onboarding_step: Math.max(user.onboarding_step, 1),
    });

    res.json({
      message: 'Personal information saved successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        date_of_birth: user.date_of_birth,
        onboarding_step: user.onboarding_step,
      }
    });
  } catch (error) {
    console.error('Error saving personal information:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/onboarding/step2 - Address Information
router.post('/step2', authenticateToken, async (req, res) => {
  try {
    const { street_address, city, postal_code, country } = req.body;

    // Validate required fields
    if (!street_address || !city || !postal_code) {
      return res.status(400).json({ error: 'Street address, city, and postal code are required' });
    }

    // Get or create user settings
    let userSettings = await UserSettings.findOne({ where: { user_id: req.user.id } });
    
    if (!userSettings) {
      userSettings = await UserSettings.create({
        user_id: req.user.id,
        street_address,
        city,
        postal_code,
        country: country || 'South Africa',
      });
    } else {
      await userSettings.update({
        street_address,
        city,
        postal_code,
        country: country || userSettings.country,
      });
    }

    // Update user onboarding step
    const user = await User.findByPk(req.user.id);
    await user.update({
      onboarding_step: Math.max(user.onboarding_step, 2),
    });

    res.json({
      message: 'Address information saved successfully',
      settings: {
        street_address: userSettings.street_address,
        city: userSettings.city,
        postal_code: userSettings.postal_code,
        country: userSettings.country,
      },
      onboarding_step: user.onboarding_step,
    });
  } catch (error) {
    console.error('Error saving address information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/onboarding/complete - Complete onboarding
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Verify minimum requirements
    if (!user.username || !user.first_name || !user.last_name) {
      return res.status(400).json({ error: 'Please complete all required steps before finishing onboarding' });
    }

    const userSettings = await UserSettings.findOne({ where: { user_id: req.user.id } });
    if (!userSettings || !userSettings.street_address || !userSettings.city || !userSettings.postal_code) {
      return res.status(400).json({ error: 'Please complete address information before finishing onboarding' });
    }

    // Complete onboarding
    await user.update({
      onboarding_completed: true,
      onboarding_step: 3,
      account_status: 'active',
    });

    res.json({
      message: 'Onboarding completed successfully! Welcome to BankApp!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_completed: user.onboarding_completed,
        account_status: user.account_status,
      }
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/onboarding/username-available/:username - Check username availability
router.get('/username-available/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(username)) {
      return res.json({ 
        available: false, 
        message: 'Username must be 3-50 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }

    const existingUser = await User.findByUsername(username);
    res.json({ 
      available: !existingUser,
      message: existingUser ? 'Username already taken' : 'Username available'
    });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
