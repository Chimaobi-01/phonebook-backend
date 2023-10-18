const mongoose = require('mongoose');


const password = 'KUjBs4qkrWEwhKSt'
const url = `mongodb+srv://chimaobi01:${password}@cluster0.fyuntux.mongodb.net/phonebookApp?retryWrites=true&w=majority`

console.log('Connecting to MongoDB...');
mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.log('Cannot reach your Database at the moment', error))

// schema
const personSchema = new mongoose.Schema({ 
    name: {
        type: String,
        minLength: 3,
        required: true
    }, 
    number: {
        type: String,
        minLength: 8,
        validate: v => /\d{2}-\n/.test(v),
        message: props => `${props.value} is not a valid number`,
        required: true
    },  
})
personSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)