const mongoose = require('mongoose')

// define phonebook records
const recordSchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Record = mongoose.model('Record', recordSchema)

// connect to db
const connectToDB = (password) =>{
  const appName = 'phonebook-app'
  const url =
    `mongodb+srv://nick:${password}@cluster0.rbzkdxs.mongodb.net/${appName}?retryWrites=true&w=majority`
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
}

const GET_INFO = 3
const ADD_RECORD = 5
const MODE = process.argv.length

// do stuff
switch (MODE) {
  case GET_INFO: {
    const password = process.argv[2]

    connectToDB(password)
    
    // get all records
    Record.find({}).then(result => {
      console.log('phonebook:')
      result.map(record => {
        console.log(`${record.name} ${record.number}`)
      })
      mongoose.connection.close()
    })
    break
  }

  case ADD_RECORD: {
    const [ password, name, phoneNumber ] = process.argv.slice(2)

    connectToDB(password)
    
    // add record from command line input
    const record = new Record({
      name: name,
      number: phoneNumber,
    })

    // log success and close connection
    record.save().then(result => {
      console.log(`added ${name}'s number ${phoneNumber} to phonebook`)
      mongoose.connection.close()
    })
    break
  }

  default: {
    console.log('usage: node mongo.js <password> <name> <number>')
    process.exit(1)
    break
  }

}
