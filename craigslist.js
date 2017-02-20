const cl = require('node-craigslist')
const apartmentController = require('./db/controllers/apartment.js')
const slack = require('./slack.js')

const SEARCH_OPTIONS = require('./constants').SEARCH_OPTIONS
const filter = require('./filters')

let client = new cl.Client()

function start () {
  scrape(function (err, filtered) {
    if (err) console.log(err)

    filtered.forEach(function (result) {
      details(result, function (err, listing) {
        if (err) return console.log(err.message)

        // save listing to db
        apartmentController.insertOne(listing, function (err, doc) {
          if (err) return console.log(err.message)

          slack(listing, result)
        })
      })
    })
  })
}

function scrape (cb) {
  client.list(SEARCH_OPTIONS, function (err, results) {
    if (err) return cb(err, null)

    filter(results, function (err, filtered) {
      if (err) return cb(err)

      cb(null, filtered)
    })
  })
}

function details (item, cb) {
  client.details(item, function (err, listing) {
    if (err) return console.log(err)

    cb(null, listing)
  })
}

module.exports = {start}
