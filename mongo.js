const mongoose = require('mongoose')
const Record = require('./models/record')

// connect to db
const GET_INFO = 2
const ADD_RECORD = 4
const MODE = process.argv.length

// do stuff
switch (MODE) {
  case GET_INFO: {
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
    const [ name, phoneNumber ] = process.argv.slice(2)

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
