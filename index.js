const express = require('express')
const app = express()

const { persons } = require('./data.js')


app.get('/api/persons', (req, res) => {
  res.json(persons)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})