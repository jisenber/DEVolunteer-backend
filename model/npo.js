'use strict';

let mongoose = require('mongoose');

let npoSchema = mongoose.Schema({
  username: {type: String, ref: 'users'},
  org: {type: String, required: true, unique: true}, //organization name
  city: {type: String},
  website: {type: String},
  picture: {type: String},
  state: {type: String},
  phone: {type: String},
  email: {type: String},
  optIn: {type: Boolean},
  projects: [{type: String}],
  developers: [{type: mongoose.Schema.Types.ObjectId, ref: 'devs'}],
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
});


module.exports = mongoose.model('npos', npoSchema);
