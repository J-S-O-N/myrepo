const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, UserSettings } = require('../models/index.cjs');
require('dotenv').config();

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      console.log('Registration - Password to hash:', password);
      const password_hash = await bcrypt.hash(password, 10);
      console.log('Registration - Generated hash:', password_hash);

      // Immediately test the hash
      const testCompare = await bcrypt.compare(password, password_hash);
      console.log('Registration - Immediate hash test:', testCompare);

      // Create user
      const user = await User.create({
        email,
        password_hash,
      });

      console.log('Registration - Hash saved to DB:', user.password_hash);

      // Create default settings for the user (per-user isolation)
      await UserSettings.create({
        user_id: user.id,
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

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      console.log('Login attempt for:', email);
      console.log('User found:', !!user);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log('Password hash from DB:', user.password_hash);
      console.log('Password provided:', password);

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      console.log('Password valid:', isValidPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token (contains user.id for per-user isolation)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

module.exports = router;
