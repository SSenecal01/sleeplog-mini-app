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
  await client.connect();

  db = client.db('SleepLogs'); 
  console.log('Connected to MongoDB');
}

app.get('/api/sleep', async (req, res) => {
  const entries = await db.collection('SleepLogs').find().toArray();
  res.json(entries);
});

app.get('/api/sleep/user/:name', async (req, res) => {
  const entries = await db.collection('SleepLogs').find({ name: req.params.name }).toArray();
  res.json(entries);
});

app.get('/api/sleep/search', async (req, res) => {
  const { name } = req.query;
  const entries = await db.collection('SleepLogs').find({ name: { $regex: name, $options: 'i' } }).toArray();
  res.json(entries);
});

app.post('/api/sleep', async (req, res) => {
  const { name, date, sleepTime, wakeTime, quality } = req.body;
  const sleep = new Date(`${date}T${sleepTime}`);
  const wake = new Date(`${date}T${wakeTime}`);
  const durationMs = wake - sleep < 0 ? wake - sleep + 86400000 : wake - sleep;
  const hoursSlept = (durationMs / 3600000).toFixed(2);

  const entry = { name, date, sleepTime, wakeTime, hoursSlept, quality };
  const result = await db.collection('SleepLogs').insertOne(entry);
  res.json(result);
});

app.delete('/api/sleep/:id', async (req, res) => {
  const result = await db.collection('SleepLogs').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Sleep Log app listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

