'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Temperature Reading Record
var tempReadingSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // One Week expiration
    },

    reading: {
        type: Number
    }

});

// Temperature Sensor Record
var TempSensorSchema = new Schema({
    name: {
        type: String,
        default: 'Temperature Sensor' // Default Name
    },
    address: String,
    logInterval: {
        type: Number,
        default: 30   // Default time in seconds
    },

    readings: [tempReadingSchema]
});







module.exports = mongoose.model('TempSensor', TempSensorSchema);