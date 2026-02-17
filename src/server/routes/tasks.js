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

// POST create a new task
router.post('/', async (req, res) => {
  try {
    const { text, completed = false } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const tasksCollection = getCollection('tasks');
    const newTask = {
      text: text.trim(),
      completed: Boolean(completed),
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

    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Task text must be a non-empty string' });
      }
      updateData.text = text.trim();
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
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
