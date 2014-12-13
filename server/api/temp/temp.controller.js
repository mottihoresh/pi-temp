'use strict';

var _ = require('lodash');
var Temp = require('./temp.model');
var events = require('events');
var em = new events.EventEmitter();
var w1bus = require('node-w1bus');

// Some init code here
var bus = w1bus.create();
var probes = [];

/**
 * Update the probes array with the list of new arrays.
 * @param data
 */
var updateProbeList = function(data){
    if(data.ids.length > 0) {
        probes = data.ids;
        em.emit('probe:update-list', probes);
    }

};

var checkProbesValues = function(){
    if(probes.length>0) {
        _.forEach(probes, function(probe){
            bus.getValueFrom(probe, 'temperature')
                .then(function(res){
                    em.emit('probe:reading', {'address':probe, 'reading':res.result.value});
                });

            //// debug stuff comment out on pi
            //setTimeout(function(){
            //    em.emit('probe:reading', {'address':probe, 'reading':Math.floor(Math.random()*100)});
            //},100);
        });
    }
};

(function checkProbes(){

    setTimeout(function(){

        bus.listAllSensors()
            .then(updateProbeList);

        //// debug code, since i'm not working on the pi right now
        //setTimeout(function(){
        //    updateProbeList({ids:['28-000003bb5c70']});
        //},300);


        checkProbesValues();

        checkProbes();
    },1000);
})();

exports.on = function(event,cb){
    em.on(event,cb);
};

// Get list of temps
exports.index = function(req, res) {
  Temp.find(function (err, temps) {
    if(err) { return handleError(res, err); }
    return res.json(200, temps);
  });
};

// Get a single temp
exports.show = function(req, res) {
  Temp.findById(req.params.id, function (err, temp) {
    if(err) { return handleError(res, err); }
    if(!temp) { return res.send(404); }
    return res.json(temp);
  });
};

// Creates a new temp in the DB.
exports.create = function(req, res) {
  Temp.create(req.body, function(err, temp) {
    if(err) { return handleError(res, err); }
    return res.json(201, temp);
  });
};

// Updates an existing temp in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Temp.findById(req.params.id, function (err, temp) {
    if (err) { return handleError(res, err); }
    if(!temp) { return res.send(404); }
    var updated = _.merge(temp, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, temp);
    });
  });
};

// Deletes a temp from the DB.
exports.destroy = function(req, res) {
  Temp.findById(req.params.id, function (err, temp) {
    if(err) { return handleError(res, err); }
    if(!temp) { return res.send(404); }
    temp.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}