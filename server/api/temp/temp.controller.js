'use strict';

var _ = require('lodash');
var TempSensor = require('./tempSensor.model');
var TempReading = require('./sensorReading.model');
var events = require('events');
var em = new events.EventEmitter();
var w1bus = require('node-w1bus');
var moment = require('moment');

// Some init code here
var bus = w1bus.create();
var probes = [];

/**
 * Update the probes array with the list of new arrays.
 * @param data
 */
var updateProbeList = function (data) {
    if (data.ids.length > 0) {
        probes = data.ids;

        // Check if probe address is in database, if not add it.
        _.forEach(probes, function (probeAddress) {
            TempSensor.find({address: probeAddress},
                function (err, docs) {
                    if (err) {
                        return err;
                    }

                    if (!(docs.length > 0)) {
                        // Not Found, create it.
                        TempSensor.create({'address': probeAddress});
                    }

                });
        });

        // Emit Event:
        em.emit('probe:update-list', probes);
    }

};

var checkProbesValues = function () {
    if (probes.length > 0) {
        _.forEach(probes, function (probe) {
            bus.getValueFrom(probe, 'temperature')
                .then(function (res) {

                    // Record Data.
                    //console.log(probe);
                    var temperature = res.result.value;
                    recordNewReading(probe, temperature);

                    // Emit Data for other modules to use.
                    em.emit('probe:reading', {
                        'address': probe,
                        'reading': res.result.value
                    });
                });

            // debug stuff comment out on pi
            //setTimeout(function () {
            //
            //    var temperature = Math.floor(Math.random() * 100);
            //    // Try to find probe
            //
            //    //console.log('recodring data');
            //
            //    recordNewReading(probe, temperature);
            //
            //    em.emit('probe:reading', {
            //        'address': probe,
            //        'reading': temperature
            //    });
            //}, 5000);


        });
    }
};

var recordNewReading = function (probe, reading) {
    //console.log('trying to record....', probe, reading);


    // GET SENSOR INFO
    TempSensor
        .findOne({'address': probe})
        .select('logInterval')
        .exec(function (err, probeObj) {

            if (!err) {
                // GET LAST READING DATE
                //console.log(probeObj);


                // Record new reading.
                //TempReading.create({reading:40, sensorId: probeObj._id},function(err,data){});

                TempReading
                    .findOne({sensorId: probeObj._id})
                    .sort('-createdAt')
                    .exec(function (err, data) {

                        //
                        //console.log('\n--------');
                        //console.log(data);
                        //console.log('last created:', new moment(data.createdAt).format());
                        //console.log('now: ', new moment().format());
                        //console.log('now: ', new moment().add(30, 's').format());

                        if (data === null || moment().format() > moment(data.createdAt).add(30, 's').format()) {
                            //console.log('new recording');
                            TempReading.create({
                                reading: reading,
                                sensorId: probeObj._id
                            }, function (err, data) {
                            });

                        }
                        else {
                            //console.log('not enough time has passed since last recording');
                        }
                        //console.log(err, data);
                    });
            }


        });


    //TempSensor.findOne(
    //    {'address': probe},
    //    ['logInterval'],
    //    function(err,data){
    //        console.log(err,data);
    //    });
};


(function checkProbes() {

    setTimeout(function () {

        bus.listAllSensors()
            .then(updateProbeList);

        // debug code, since i'm not working on the pi right now
        //setTimeout(function () {
        //    updateProbeList({ids: ['28-000003bb5c70']});
        //}, 300);

        checkProbesValues();
        checkProbes();

    }, 1000);
})();





exports.on = function (event, cb) {
    em.on(event, cb);
};

// Get list of temps
exports.index = function (req, res) {
    TempSensor.find(function (err, temps) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, temps);
    });
};

// Get a single temp
exports.show = function (req, res) {
    TempSensor.findOne({address: req.params.address}, function (err, temp) {
        if (err) {
            return handleError(res, err);
        }
        if (!temp) {
            return res.send(404);
        }

        var readings = {readings: []};

        TempReading
            .find({
                sensorId: temp._id,
                createdAt: {$gte: moment().subtract(24, 'h').format()}
            })
            .sort('-createdAt').exec(function (err, data) {
            if (!err) {
                readings.readings = data.reverse();
            }
            return res.json(_.merge(readings,temp._doc));
        });


    });
};

// Creates a new temp in the DB.
exports.create = function (req, res) {
    TempSensor.create(req.body, function (err, temp) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, temp);
    });
};

// Updates an existing temp in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    TempSensor.findById(req.params.id, function (err, temp) {
        if (err) {
            return handleError(res, err);
        }
        if (!temp) {
            return res.send(404);
        }
        var updated = _.merge(temp, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, temp);
        });
    });
};

// Deletes a temp from the DB.
exports.destroy = function (req, res) {
    Temp.findById(req.params.id, function (err, temp) {
        if (err) {
            return handleError(res, err);
        }
        if (!temp) {
            return res.send(404);
        }
        temp.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}