const mongoose = require('mongoose')

const apartmentSchema = mongoose.Schema({
  pid: {type: String, unique: true},
  title: {type: String, unique: true}
})

const ApartmentModel = mongoose.model('Apartment', apartmentSchema)

module.exports = ApartmentModel
