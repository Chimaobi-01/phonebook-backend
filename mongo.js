const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('include password to connect to database');
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://chimaobi01:${password}@cluster0.fyuntux.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// schema
const personSchema = new mongoose.Schema({ name: String, number: String, })
// model
const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})



if (process.argv.length === 3) {
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
    })
} else {
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close()
    })
}

