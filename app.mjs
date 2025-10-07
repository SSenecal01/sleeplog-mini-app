import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
async function connectToDb() {
  try {
    await client.connect();
    db = client.db('Cluster0');
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB (db: Cluster0)');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

app.get('/api/sleep', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const entries = await db.collection('SleepLogs').find().toArray();
    res.json(entries);
  } catch (err) {
    console.error('GET /api/sleep error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sleep/user/:name', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const entries = await db.collection('SleepLogs').find({ name: req.params.name }).toArray();
    res.json(entries);
  } catch (err) {
    console.error('GET /api/sleep/user/:name error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sleep/search', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Query parameter "name" is required' });
    const entries = await db.collection('SleepLogs').find({ name: { $regex: name, $options: 'i' } }).toArray();
    res.json(entries);
  } catch (err) {
    console.error('GET /api/sleep/search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sleep', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { name, date, sleepTime, wakeTime, quality } = req.body;
    if (!name || !date || !sleepTime || !wakeTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sleep = new Date(`${date}T${sleepTime}`);
    const wake = new Date(`${date}T${wakeTime}`);
    const durationMs = wake - sleep < 0 ? wake - sleep + 86400000 : wake - sleep;
    const hoursSlept = (durationMs / 3600000).toFixed(2);

    const entry = { name, date, sleepTime, wakeTime, hoursSlept, quality };
    const result = await db.collection('SleepLogs').insertOne(entry);
    console.log('Inserted SleepLogs document id:', result.insertedId);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error('POST /api/sleep error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/sleep/:id', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const result = await db.collection('SleepLogs').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    console.error('DELETE /api/sleep/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/diag', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const count = await db.collection('SleepLogs').countDocuments();
    res.json({ dbName: db.databaseName, collection: 'SleepLogs', count });
  } catch (err) {
    console.error('GET /api/diag error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Connection check
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Sleep Log app listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

