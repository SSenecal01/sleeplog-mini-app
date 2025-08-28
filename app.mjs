import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname + 'public')));

app.get('/', (req, res) => {
  res.send('Hello Express from Render. <a href="samuel.html">samuel</a>')
})

// endpoints...middlewares...apis'
// send an html file

app.get('/samuel', (req, res) => {
  // res.send('samuel. <a href="/')
  res.sendFile(path.join(__dirname, 'public', 'samuel.html'));
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// TODO: refactor to use any port

