/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Temp = require('./temp.model');

exports.register = function(socket) {
  Temp.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Temp.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('temp:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('temp:remove', doc);
}