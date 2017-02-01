const User = require('../models/apartment.js')

const findOne = (pid, callback) => {
  User.findOne({pid: pid}, callback)
}

const insertOne = (pid, callback) => {
  User.create({pid: pid}, callback)
}

module.exports = {findOne, insertOne}
