/**
 * Seed script: populates the database with 1000+ records for rubric requirement.
 * Run: npm run seed
 */
import {
  connectDatabase,
  closeDatabase,
  getCollection,
} from '../src/server/db/database.js';

const TASK_SAMPLES = [
  'Read chapter 3',
  'Review lecture notes',
  'Complete assignment',
  'Study for exam',
  'Write report',
  'Prepare presentation',
  'Email professor',
  'Update resume',
  'Practice coding',
  'Debug project',
  'Research topic',
  'Attend meeting',
  'Call client',
  'Submit homework',
  'Organize desk',
  'Plan week',
  'Exercise',
  'Meditate',
  'Grocery shopping',
  'Pay bills',
];

const PERIODS = ['anytime', 'morning', 'afternoon', 'evening'];

function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    await connectDatabase();
    const tasksCollection = getCollection('tasks');
    const sessionsCollection = getCollection('sessions');

    const taskCount = 600;
    const sessionCount = 600;

    const tasks = [];
    const now = new Date();
    for (let i = 0; i < taskCount; i++) {
      const daysAgo = randomInt(0, 90);
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      const dateStr = toDateString(d);
      tasks.push({
        text: `${randomItem(TASK_SAMPLES)} ${i + 1}`,
        completed: Math.random() > 0.5,
        period: randomItem(PERIODS),
        duration: randomItem([15, 25, 30, 45, 60]),
        date: dateStr,
        createdAt: d,
        updatedAt: d,
      });
    }

    const insertedTasks = await tasksCollection.insertMany(tasks);
    const taskIds = Object.values(insertedTasks.insertedIds);

    const sessions = [];
    for (let i = 0; i < sessionCount; i++) {
      const daysAgo = randomInt(0, 90);
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      const durationSec = randomInt(5, 60) * 60;
      sessions.push({
        taskId: Math.random() > 0.3 ? taskIds[i % taskIds.length] : null,
        duration: durationSec,
        completed: Math.random() > 0.2,
        createdAt: d,
        updatedAt: d,
      });
    }

    await sessionsCollection.insertMany(sessions);

    const totalTasks = await tasksCollection.countDocuments();
    const totalSessions = await sessionsCollection.countDocuments();

    console.log(`Seed complete: ${totalTasks} tasks, ${totalSessions} sessions`);
    console.log(`Total records: ${totalTasks + totalSessions}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

seed();
