require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// logging
morgan.token('body', req => `body: ${JSON.stringify(req.body)}`)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let { persons } = require('./data.js')

// get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// get info about phonebook
app.get('/api/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// get person by id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// delete person by id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  if (persons.find(person => person.name === name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name,
    number,
    id: Math.floor(Math.random() * 1000000)
  }

  persons = persons.concat(person)

  res.json(person)

})

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})