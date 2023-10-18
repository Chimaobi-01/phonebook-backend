// const dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./module/person');


const app = express()
app.use(cors())
app.use(express.static('build'))
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
    Person.find({}).then(persons => res.json(persons))
}
const handlePOSTRequestToPersonsJSON = (req, res, next) => {
    const body = req.body
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(person => res.json(person))
    .catch(error => next(error))
}

const handleGETRequestToPersonByID = (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => res.json(person)).catch(error => next(error))
}
const handlePUTRequestToPersonByID = (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(result => res.json(result))
    .catch(error => next(error))
}
const handleDELETERequestToPersonByID = (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
}
const handleGETRequestToInfo = (req, res, next) => {
   
    const date = new Date()
    Person.find({})
    .then(result => {
        res.send(`
    <p>Phonebook has info for ${result.length} persons from database</p>
    <p>${date.toString()}</p>
    `)
    })
    .catch(error => next(error))
    
}
const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if(error.name === "CastError"){
        return response.status(400).send({ error: "malfuntioned id"})
    }
    else if(error.name === "ValidationError"){
        return response.status(400).send({ error: error.message})
    }
    next(error)
}



app.get('/', handleGETRequestToHome)
app.get('/api/persons', handleGETRequestToPersonsJSON)
app.get('/info', handleGETRequestToInfo)
app.get('/api/persons/:id', handleGETRequestToPersonByID)
app.delete('/api/persons/:id', handleDELETERequestToPersonByID)
app.put('/api/persons/:id', handlePUTRequestToPersonByID)
app.post('/api/persons', handlePOSTRequestToPersonsJSON)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is starting at http://localhost:${PORT}`)
})









