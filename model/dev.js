'use strict'

let mongoose = require('mongoose')

//Dev user model
let devSchema = mongoose.Schema({

  username: {type: String, ref: 'users', unique: true},
  name: {type: String},
  desc: {type: String},
  city: {type: String},
  state: {type: String},
  phone: {type: String},
  email: {type: String},
  picture: {type: String},
  website: {type: String},
  // Languages the Dev knows
  javascript: {type: Boolean},
  html: {type: Boolean},
  angular: {type: Boolean},
  react: {type: Boolean},
  python: {type: Boolean},
  otherlang: {type: Boolean},
  // Services the Dev provides
  websitework: {type: Boolean},
  webapp: {type: Boolean},
  mobileapp: {type: Boolean},
  otherwork: {type: Boolean},
  available: {type: Boolean},
  experience: {type: String},
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
});


module.exports = mongoose.model('devs', devSchema);
