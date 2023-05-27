require('dotenv').config()
const morgan  = require('morgan')     // logging
const express = require('express')
const cors    = require('cors')
const app     = express()

// models
const Person  = require('./models/record')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// logging
morgan.token('body', req => `body: ${JSON.stringify(req.body)}`)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    if (!persons) {
      res.status(404).end()
    }
    res.json(persons)
  } catch (err) {
    next(err)
    //// old way
    // console.log('get', err.message)
    // res.status(500).end()
  }
})

app.get('/api/info', async (req, res, next) => {
  try {
    const persons = await Person.find({})

    if (!persons) {
      res.status(404).end()
    }

    const date = new Date()
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)

  } catch (err) {
    next(err)
    //// old way
    // console.log('get_info', err.message)
    // res.status(500).end()
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (!person) {
      res.status(404).end()
    }
    res.json(person)
  } catch (err) {
    next(err)
    //// old way
    // console.log('get_by_id', err.message)
    // res.status(400).send({ error: 'malformatted id'})
  }
})

// update record if already existing
app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' },  // options
    )
    res.json(updatedPerson)
  } catch (err) {
    next(err)
  }
})

// delete person by id
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id)
    console.log('deleted', deletedPerson)
    res.status(204).end()
  } catch (err) {
    next(err)
    //// old way
    // console.log('delete error: ', err.message)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  try {
    if (await Person.findOne({ name: name })) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    const newPerson = new Person({
      name: name,
      number: number,
    })
    await newPerson.save()

    res.json(newPerson)
  } catch (err) {
    next(err)
  }
})

// handle undefined routes
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// error handler
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }
  next(err)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
