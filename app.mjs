import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('I Fucking Hate Jacob')
})

app.listen(3000)
