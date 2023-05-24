const mongoose = require('mongoose')

// get password from command line input
if (process.argv.length<5) {
  console.log('usage: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const [ password, name, phoneNumber ] = process.argv.slice(2)

// connect to db
const appName = 'phonebook-app'
const url = 
  `mongodb+srv://nick:${password}@cluster0.rbzkdxs.mongodb.net/${appName}?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

// define phonebook records
const recordSchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Record = mongoose.model('Record', recordSchema)

// add record from command line input
const record = new Record({
  name: name,
  number: phoneNumber,
})
record.save().then(result => {
  console.log('record saved!')
  mongoose.connection.close()
})
