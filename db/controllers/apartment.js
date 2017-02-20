const Apt = require('../models/apartment.js')

function findOneById (pid, callback) {
  Apt.findOne({pid: pid}, callback)
}

function findOneByTitle (title, callback) {
  Apt.findOne({title: title}, callback)
}

const insertOne = (result, callback) => {
  const doc = {
    pid: result.pid,
    title: result.title
  }

  Apt.create(doc, callback)
}

module.exports = {findOneById, findOneByTitle, insertOne}
