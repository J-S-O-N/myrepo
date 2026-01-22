const express = require('express');
const { body, validationResult } = require('express-validator');
const { Goal } = require('../models/index.cjs');
const authMiddleware = require('../middleware/auth.cjs');

const router = express.Router();

// All routes require authentication (per-user isolation via JWT)
router.use(authMiddleware);

// Get all goals for authenticated user
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Get single goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id, // Per-user isolation
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

// Create new goal
router.post(
  '/',
  [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('target_amount').isInt({ min: 0 }).withMessage('Target amount must be a positive number'),
    body('current_amount').optional().isInt({ min: 0 }).withMessage('Current amount must be a positive number'),
    body('target_date').optional().isISO8601().withMessage('Invalid date format'),
    body('category').optional().isString(),
    body('description').optional().isString(),
    body('icon').optional().isString(),
    body('color').optional().isString(),
    body('status').optional().isIn(['active', 'completed', 'paused']),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        target_amount,
        current_amount,
        target_date,
        category,
        icon,
        color,
        status,
      } = req.body;

      // Create goal for authenticated user
      const goal = await Goal.create({
        user_id: req.user.id,
        title,
        description,
        target_amount,
        current_amount: current_amount || 0,
        target_date,
        category: category || 'Other',
        icon: icon || '🎯',
        color: color || 'blue',
        status: status || 'active',
      });

      res.status(201).json({ goal });
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  }
);

// Update goal
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().trim(),
    body('target_amount').optional().isInt({ min: 0 }),
    body('current_amount').optional().isInt({ min: 0 }),
    body('target_date').optional().isISO8601(),
    body('category').optional().isString(),
    body('description').optional().isString(),
    body('icon').optional().isString(),
    body('color').optional().isString(),
    body('status').optional().isIn(['active', 'completed', 'paused']),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Find goal for authenticated user only
      const goal = await Goal.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id, // Per-user isolation
        },
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      // Update only provided fields
      const allowedFields = [
        'title',
        'description',
        'target_amount',
        'current_amount',
        'target_date',
        'category',
        'icon',
        'color',
        'status',
      ];

      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // Update goal
      await goal.update(updates);

      res.json({ goal });
    } catch (error) {
      console.error('Update goal error:', error);
      res.status(500).json({ error: 'Failed to update goal' });
    }
  }
);

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    // Find goal for authenticated user only
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id, // Per-user isolation
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Delete goal
    await goal.destroy();

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
