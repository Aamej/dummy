const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Flow = require('../models/Flow');
const auth = require('../middleware/auth');

// @route   GET /api/flows
// @desc    Get all flows for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const flows = await Flow.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ flows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/flows/:id
// @desc    Get a specific flow by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const flow = await Flow.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!flow) {
      return res.status(404).json({ error: 'Flow not found' });
    }

    res.json(flow);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Flow not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/flows
// @desc    Create a new flow
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      body('name', 'Name is required').notEmpty(),
      body('nodes', 'Nodes must be an array').isArray(),
      body('edges', 'Edges must be an array').isArray(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, nodes, edges } = req.body;

    try {
      const newFlow = new Flow({
        name,
        description,
        nodes,
        edges,
        userId: req.user.id,
      });

      const flow = await newFlow.save();
      res.json(flow);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/flows/:id
// @desc    Update an existing flow
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      body('name', 'Name is required').notEmpty(),
      body('nodes', 'Nodes must be an array').isArray(),
      body('edges', 'Edges must be an array').isArray(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, nodes, edges, isActive } = req.body;

    try {
      let flow = await Flow.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!flow) {
        return res.status(404).json({ error: 'Flow not found' });
      }

      // Update flow fields
      flow.name = name;
      flow.description = description;
      flow.nodes = nodes;
      flow.edges = edges;
      
      if (isActive !== undefined) {
        flow.isActive = isActive;
      }

      await flow.save();
      res.json(flow);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Flow not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/flows/:id
// @desc    Delete a flow
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const flow = await Flow.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!flow) {
      return res.status(404).json({ error: 'Flow not found' });
    }

    await flow.remove();
    res.json({ message: 'Flow deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Flow not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
