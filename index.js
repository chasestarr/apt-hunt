require('dotenv').config()
const db = require('./db/init.js')
const cl = require('./craigslist.js')

db.init(function () {
  cl.start()
})

setInterval(cl.start, 1800 * 1000)
