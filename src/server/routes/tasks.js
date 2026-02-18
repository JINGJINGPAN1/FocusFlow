import express from 'express';
import { getCollection } from '../db/database.js';

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasksCollection = getCollection('tasks');
    const tasks = await tasksCollection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const tasksCollection = getCollection('tasks');
    const { ObjectId } = await import('mongodb');
    const task = await tasksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

const VALID_PERIODS = ['anytime', 'morning', 'afternoon', 'evening'];

// POST create a new task
router.post('/', async (req, res) => {
  try {
    const { text, completed = false, period = 'anytime', duration } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const taskPeriod = VALID_PERIODS.includes(period) ? period : 'anytime';
    const parsedDuration =
      duration !== undefined && duration !== '' && duration !== null
        ? parseInt(duration, 10)
        : NaN;
    const taskDuration =
      !isNaN(parsedDuration) && parsedDuration > 0
        ? Math.max(5, Math.min(180, parsedDuration))
        : 25;

    const tasksCollection = getCollection('tasks');
    const newTask = {
      text: text.trim(),
      completed: Boolean(completed),
      period: taskPeriod,
      duration: taskDuration,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask);
    const task = await tasksCollection.findOne({ _id: result.insertedId });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const tasksCollection = getCollection('tasks');
    const { text, completed } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (req.body.period !== undefined) {
      updateData.period = VALID_PERIODS.includes(req.body.period)
        ? req.body.period
        : 'anytime';
    }

    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Task text must be a non-empty string' });
      }
      updateData.text = text.trim();
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const updateObj = { $set: updateData };
    if (
      req.body.duration !== undefined &&
      (req.body.duration === '' || req.body.duration === null)
    ) {
      updateObj.$unset = { duration: '' };
    } else if (req.body.duration !== undefined) {
      const d = parseInt(req.body.duration, 10);
      if (!isNaN(d)) {
        updateData.duration = Math.max(5, Math.min(180, d));
      }
    }

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      updateObj
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await tasksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const tasksCollection = getCollection('tasks');

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
