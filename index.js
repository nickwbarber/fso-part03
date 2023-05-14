const express = require('express')
const app = express()

const { persons } = require('./data.js')


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})