'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TempSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Temp', TempSchema);