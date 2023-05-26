// record.js

require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// get db url from environment
const url = process.env.MONGODB_URI

console.log('connecting to', url)

// connect to db
mongoose.connect(url)
  .then(res => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message)
  })

// define phonebook records
const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v =>
           /\d{2}-\d{6}/.test(v)
        || /\d{3}-\d{5}/.test(v)
      ),
      message: props => `${props.value} is not a valid phone number`,
    },
  },
})

// scrub unused fields
recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// export model
module.exports = mongoose.model('Record', recordSchema)
