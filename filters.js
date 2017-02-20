const ApartmentController = require('./db/controllers/apartment')
const NEIGHBORHOODS = require('./constants').NEIGHBORHOODS

function filter (results, cb) {
  let completed = 0
  const matches = []

  function done () {
    if (completed === results.length) {
      cb(null, matches)
    }
  }

  results.forEach(function (result, index) {
    applyFilters(result, function (err) {
      completed++

      if (err) return done()

      matches.push(result)
      done()
    })
  })
}

function applyFilters (result, cb) {
  // if not in neighborhood, cb with error
  if (!isNeighborhood(result, NEIGHBORHOODS)) {
    return cb(new Error('Listing not in desired neighborhood'))
  }

  // if no pic, cb with error
  if (!result.hasPic) {
    return cb(new Error('listing does not have an image'))
  }

  // if result exists in db, cb with error
  inDb(result, function (err) {
    if (err) return cb(err)

    cb()
  })
}

function isNeighborhood (result, neighborhoods) {
  const hood = result.location.substring(1, result.location.length - 1)
  if (neighborhoods[hood]) {
    return true
  }
  return false
}

function inDb (result, cb) {
  uniquePid(result, function (err) {
    if (err) return cb(err)

    uniqueTitle(result, function (err) {
      if (err) return cb(err)

      cb()
    })
  })
}

function uniqueTitle (result, cb) {
  ApartmentController.findOneByTitle(result.title, function (err, doc) {
    if (err) return cb(err)

    if (doc) return cb(new Error('title exists in db'))

    cb()
  })
}

function uniquePid (result, cb) {
  ApartmentController.findOneById(result.pid, function (err, doc) {
    if (err) return cb(err)

    if (doc) return cb(new Error('id exists in db'))

    cb()
  })
}

module.exports = filter
