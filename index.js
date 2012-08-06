var MIDIStream = require('./lib/midi-stream');

exports.MIDIStream = MIDIStream;

exports.readable = function(port) {
  return new MIDIStream(port, 'input');
};
exports.writable = function(port) {
  return new MIDIStream(port, 'output');
};
exports.macsynth = function() {
  return new MIDIStream(/^mac\-synth\//, 'output');
};