const cl = require('node-craigslist')
const apartmentController = require('./db/controllers/apartment.js')
const slack = require('./slack.js')

let client = new cl.Client()

const options = {
  city: 'sfbay',
  category: 'apa',
  minAsk: '2500',
  maxAsk: '3500'
}

const NEIGHBORHOODS = {
  'lower pac hts': 1,
  'alamo square / nopa': 1,
  'hayes valley': 1,
  'cole valley / ashbury hts': 1,
  'pacific heights': 1,
  'western addition': 1
}

function start () {
  scrape(function (err, filtered) {
    if (err) console.log(err)

    for (let i = 0; i < filtered.length; i++) {
      details(filtered[i], function (err, result) {
        if (err) console.log(err)

        apartmentController.insertOne(result.pid, function (err, doc) {
          if (err) return console.log(err.message)

          // make slack request
          const payload = {
            attachments: [
              {
                title: result.title,
                title_link: result.url,
                color: 'good',
                image_url: result.images ? result.images[0] : null,
                fallback: `[${result.title}]: <${result.url}>`
              }
            ]
          }
          slack.send(payload)
        })
        // db.close()
      })
    }
  })
}

function scrape (cb) {
  client.list(options, function (err, results) {
    if (err) return cb(err, null)

    const filter = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      applyFilters(result, function (err) {
        if (err) return console.log(err.message)
        filter.push(result)
      })
    }
    cb(null, filter)
  })
}

function details (item, cb) {
  client.details(item, function (err, listing) {
    if (err) return console.log(err)

    cb(null, listing)
  })
}

function applyFilters (result, cb) {
  if (!isNeighborhood(result, NEIGHBORHOODS)) {
    return cb(new Error('Listing not in desired neighborhood'))
  }

  // check db for existing apartment
  apartmentController.findOne(result.pid, function (err, doc) {
    if (err) return cb(err)

    if (doc) {
      return cb(new Error('apartment already exists in db'))
    }
  })

  cb()
}

function isNeighborhood (result, neighborhoods) {
  const hood = result.location.substring(1, result.location.length - 1)
  if (neighborhoods[hood]) {
    return true
  }
  return false
}

module.exports = {start}
