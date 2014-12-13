'use strict';

var _ = require('lodash');
var Temp = require('./temp.model');
var events = require('events');
var em = new events.EventEmitter();
var w1bus = require('node-w1bus');

// Some init code here
var bus = w1bus.create();
var probes = [];

bus.listAllSensors()
    .then(function(data){
        console.log('sensors?');
        console.log(data);

        var mySensor = data.ids[0];
        var opt_measureType = "temperature";

        setInterval(function(){

            data.ids.forEach(function(id){

                console.log(id);

                bus.getValueFrom(id, opt_measureType)
                    .then(function(res){
                        console.log(id+": "+res.result.value);
                    });
            });
        },500);

    });

setInterval(function(){
    em.emit('new-probe', {'address':'12x1351513'});
},5000);


console.log(em);

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