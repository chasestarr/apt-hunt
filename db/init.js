const mongoose = require('mongoose')

const uriString = process.env.MONGODB_URI || 'mongodb://localhost/apt-hunt'

function init (cb) {
  mongoose.connect(uriString, err => {
    if (err) {
      console.log(`Error connection to ${uriString}: ${err}`)
    } else {
      cb()
      console.log(`Connected to ${uriString}`)
    }
  })
}

function close () {
  mongoose.disconnect()
}

module.exports = {init, close}
