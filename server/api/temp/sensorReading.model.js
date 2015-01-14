'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Temperature Reading Record
var TempReadingSchema = new Schema({
    sensorId: { type: Schema.Types.ObjectId, ref: 'TempSensor'},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // One Week expiration
    },

    // Default Reading Interval
    readingInterval: {
        type: Number,
        default: 30
    },

    reading: {
        type: Number
    }

});



module.exports = mongoose.model('TempReading', TempReadingSchema);
