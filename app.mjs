import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname + 'public')));

app.get('/', (req, res) => {
  res.send('Hello Express from Render. <a href="samuel">samuel</a>')
})

// endpoints...middlewares...apis'
// send an html file

app.get('/samuel', (req, res) => {
  // res.send('samuel. <a href="/')
  res.sendFile(path.join(__dirname, 'public', 'samuel.html'));
})

//app.get('/api/samuel', (req, res) => {
// const myVar = "Howdy";
//})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// TODO: refactor to use any port

