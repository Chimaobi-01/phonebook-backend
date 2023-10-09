const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
const app = express()
app.use(express.json())

morgan.token('type', function (req, res) { 
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }
    return
 })
 app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))




const handleGETRequestToHome = (req, res) => {
    res.send(`<h1>Welcome to Phonebook backend </h1>`)
}
const handleGETRequestToPersonsJSON = (req, res) => {
    res.json(persons)
}
const handlePOSTRequestToPersonsJSON = (req, res) => {
    const body = req.body
    const personName = persons.find(p => p.name === body.name)
    if ((!body.name || !body.number) || (personName)) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
}
const handleGETRequestToPersonByID = (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    person ? res.json(person) : res.status(404).end(`<p style="color: red;">
    Requested user not found
    </p>`)
}
const handleDELETERequestToPersonByID = (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
}
const handleGETRequestToInfo = (req, res) => {
    const date = new Date()
    res.send(`
    <p>Phonebook has info for ${persons.length} persons</p>
    <p>${date.toString()}</p>
    `)
}




app.get('/', handleGETRequestToHome)
app.get('/api/persons', handleGETRequestToPersonsJSON)
app.get('/info', handleGETRequestToInfo)
app.get('/api/persons/:id', handleGETRequestToPersonByID)
app.delete('/api/persons/:id', handleDELETERequestToPersonByID)
app.post('/api/persons', handlePOSTRequestToPersonsJSON)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`app is starting at http://localhost:${PORT}`)
})























let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]