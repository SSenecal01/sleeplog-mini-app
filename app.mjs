import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000;
const path = require()

app.use(express.static(_dirname + 'public'));

app.get('/', (req, res) => {
  res.send('Hello Express from Render. <a href="/samuel</a>')
})

// endpoints...middlewares...apis'
// send an html file

app.get('/samuel', (req, res) => {
  // res.send('samuel. <a href="/')
  res.sendFile('samuel.html');
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// TODO: refactor to use any port

