import express from 'express';
import { getCollection } from '../db/database.js';

const router = express.Router();

// GET all sessions
router.get('/', async (req, res) => {
  try {
    const sessionsCollection = getCollection('sessions');
    const sessions = await sessionsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET a single session by ID
router.get('/:id', async (req, res) => {
  try {
    const sessionsCollection = getCollection('sessions');
    const { ObjectId } = await import('mongodb');
    const session = await sessionsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST create a new focus session
router.post('/', async (req, res) => {
  try {
    const { taskId, duration, completed = false } = req.body;

    if (!duration) {
      return res.status(400).json({ error: 'Duration is required' });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res
        .status(400)
        .json({ error: 'Duration must be a positive number' });
    }

    const sessionsCollection = getCollection('sessions');
    const newSession = {
      taskId: taskId || null,
      duration: Number(duration),
      completed: Boolean(completed),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await sessionsCollection.insertOne(newSession);
    const session = await sessionsCollection.findOne({
      _id: result.insertedId,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT update a session
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const sessionsCollection = getCollection('sessions');
    const { taskId, duration, completed } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (taskId !== undefined) {
      updateData.taskId = taskId;
    }

    if (duration !== undefined) {
      if (typeof duration !== 'number' || duration <= 0) {
        return res
          .status(400)
          .json({ error: 'Duration must be a positive number' });
      }
      updateData.duration = Number(duration);
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const result = await sessionsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const updatedSession = await sessionsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// DELETE a session
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const sessionsCollection = getCollection('sessions');

    const result = await sessionsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// GET statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const sessionsCollection = getCollection('sessions');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsToday = await sessionsCollection.countDocuments({
      createdAt: { $gte: today },
      completed: true,
    });

    const totalSessions = await sessionsCollection.countDocuments({
      completed: true,
    });

    const totalMinutesResult = await sessionsCollection
      .aggregate([
        { $match: { completed: true } },
        {
          $group: {
            _id: null,
            totalMinutes: { $sum: '$duration' },
          },
        },
      ])
      .toArray();

    const totalMinutes = totalMinutesResult[0]?.totalMinutes || 0;

    res.json({
      sessionsToday,
      totalSessions,
      totalMinutes: Math.floor(totalMinutes / 60),
      pomodoros: Math.floor(totalMinutes / 25),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
