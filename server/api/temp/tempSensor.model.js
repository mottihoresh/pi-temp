'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


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
    }

});



module.exports = mongoose.model('TempSensor', TempSensorSchema);
