require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(express.json())


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(cors())
app.use(requestLogger)

/*
let notes = [  
    {    
        id: 1,    
        content: "HTML is easy",    
        date: "2020-01-10T17:30:31.098Z",    
        important: true  
    },  
    {    
        id: 2,    
        content: "Browser can execute only Javascript",    
        date: "2020-01-10T18:39:34.091Z",    
        important: false  
    },  
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        date: "2020-01-10T19:20:14.298Z",    
        important: true  
    }
]
*/
/*
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
*/

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        res.json(note)
    }
    else {
        res.status(404).end()
    }
    
})

app.delete('/api/notes/:id', (req, res) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})