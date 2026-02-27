const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Phonebook = require('./models/phonebook')
const path = require('path')

app.use(cors())
app.use(express.json())
//app.use(express.static('dist'))
app.use(express.static(path.join(__dirname, '../client/dist')))

morgan.token('type', function (req, res) {
  return (
    req.method +
    ' ' +
    req.path +
    ' ' +
    res.statusCode +
    ' ' +
    req.get('Content-length') +
    ' ' +
    req.headers['content-type'] +
    ' ' +
    JSON.stringify(req.body)
  )
})

app.use(morgan(':type'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/info', (req, res) => {
  Phonebook.find({}).then((people) => {
    const date = new Date()
    const numOfPeople = people.length
    res.send(`
        <p>Phonebook has info for ${numOfPeople} people<p>
        <p>${date}</p>
        `)
  })
})

app.get('/api/persons/:id', async (req, res) => {
  try {
    const id = req.params.id
    const person = await Phonebook.findById(id)

    if (person) {
      res.json(person)
    } else {
      res.status(404).send({ error: 'Person not found' })
    }
  } catch {
    res.status(500).send({ error: 'malformatted id' })
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await Phonebook.deleteOne({ _id: id })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const personData = { name: body.name, number: body.number }

    const options = {
      new: true,
      runValidators: true,
    }

    const updatedEntry = await Phonebook.findByIdAndUpdate(
      id,
      personData,
      options,
    )
    if (updatedEntry) {
      res.json(updatedEntry)
    } else {
      // we check for error here instead of solely relying on next(error) because
      // next(error) handles exceptions, not finding an entry to update will return null.
      // null is not an exception, exceptions are errors the stops code from executing
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const phonebookEntry = new Phonebook({
    name: body.name,
    number: body.number,
  })

  try {
    res.json(await phonebookEntry.save())
  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  try {
    if (error.name === 'CastError') {
      return response.status(400).send({
        error: 'malformatted id',
      })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  } catch (error) {
    next(error)
  }
}

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

// should not be merged into a single middle ware error handle
app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
