/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Temp = require('./tempSensor.model');
var tempController = require('./temp.controller.js');


exports.register = function (socket) {
    Temp.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
    Temp.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });

    tempController.on('new-probe', function(data){
        console.log(data);
    });

    tempController.on('probe:update-list',function(probes){
        socket.emit('probe:update-list', probes);
    });
    tempController.on('probe:reading', function(reading) {
        socket.emit('probe:reading', reading);
    });
};

function onSave(socket, doc, cb) {
    socket.emit('temp:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('temp:remove', doc);
}