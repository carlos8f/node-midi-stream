var midi = require('midi')
  , Stream = require('stream')
  , util = require('util')

function MIDIStream(port, type) {
  Stream.call(this);
  this.readable = type === 'input';
  this.writable = type === 'output';
  this.device = new midi[type]();
  this.port = this.resolvePortName(port);
  if (this.port === false) throw new Error('could not find MIDI ' + type + ' device: ' + port + '!');
  this.portName = this.device.getPortName(this.port);
  if (this.readable) {
    this.device.on('message', this.onMessage.bind(this));
  }
  else if (this.writable) {
    this.on('data', this.onData.bind(this));
  }
  this.on('end', this.onEnd.bind(this));
  this.device.openPort(this.port);
}
util.inherits(MIDIStream, Stream);
module.exports = MIDIStream;

MIDIStream.prototype.onMessage = function(deltaTime, message) {
  this.write(message);
};

MIDIStream.prototype.onEnd = function() {
  this.device.closePort();
};

MIDIStream.prototype.write = function(chunk) {
  if (util.isArray(chunk)) chunk = fillMessage(chunk).join(',');
  this.emit('data', chunk);
};

MIDIStream.prototype.end = function(chunk) {
  if (chunk) this.write(chunk);
  this.emit('end');
};

MIDIStream.prototype.onData = function(chunk) {
  if (Buffer.isBuffer(chunk)) chunk = chunk.toString();
  var message = chunk.split(',').map(function(val) {
    return parseInt(val, 10);
  });
  this.device.sendMessage(message);
};

MIDIStream.prototype.resolvePortName = function(port) {
  if (typeof port === 'number') return port;
  if (typeof port === 'undefined') port = /.*/;
  var portCount = this.device.getPortCount(), portName;

  for (var i = 0; i < portCount; i++) {
    portName = this.device.getPortName(i);
    if ((util.isRegExp(port) && port.test(portName)) || portName === port) return i;
  }
  return false;
}

function fillMessage(message) {
  for (var i = 0; i < 3; i++) {
    if (typeof message[i] === 'undefined') {
      message[i] = 0;
    }
  }
  return message;
}