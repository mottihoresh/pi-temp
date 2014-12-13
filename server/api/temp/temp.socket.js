/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Temp = require('./temp.model');
var tempController = require('./temp.controller.js');


exports.register = function (socket) {
    Temp.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
    Temp.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });

    setInterval(function(){
        socket.emit('hello-world', 'pizza');
    },2000);

    tempController.on('new-probe', function(data){
        console.log(data);
    });

    tempController.on('probe:update-list',function(probes){
        console.log('probe list has been updated');
    });
    tempController.on('probe:reading', function(reading) {
       console.log('got a reading');
        console.log(reading);
    });
};

function onSave(socket, doc, cb) {
    socket.emit('temp:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('temp:remove', doc);
}