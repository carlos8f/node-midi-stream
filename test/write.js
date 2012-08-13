var midistream = require('../')
  , midi = require('midi')
  , spawn = require('child_process').spawn
  , resolve = require('path').resolve
  , idgen = require('idgen')
  , assert = require('assert')

var MESSAGE_CONTROLCHANGE = 0xB;
var MESSAGE_PROGRAMCHANGE = 0xC;
var MESSAGE_MSBCONTROL = 0;
var MESSAGE_LSBCONTROL = 32;
var MESSAGE_NOTEON = 0x9;
var channel = 0;
 
function messageStatus(code) {
  return code << 4 | channel;
}

describe('write test', function() {
  var instrument, sourceStream, destStream;
  process.on('exit', function() {
    if (instrument) {
      instrument.kill();
    }
  });
  it('creates destination stream', function(done) {
    instrument = spawn(resolve(__dirname, '../node_modules/.bin/mac-synth'), ['--verbose']);
    instrument.stdout.once('data', function(chunk) {
      destStream = midistream.writable(chunk.toString().match(/"(mac\-synth\/.*?)"/)[1]);
      done();
    });
  });
  it('should play the synth', function(done) {
    var expected = [
      [messageStatus(MESSAGE_CONTROLCHANGE), MESSAGE_MSBCONTROL, 0],
      [messageStatus(MESSAGE_PROGRAMCHANGE), 0, 0],
      [messageStatus(MESSAGE_NOTEON), 60, 127],
      [messageStatus(MESSAGE_NOTEON), 60, 0]
    ];
    var messages = [
      '1', '76', ',0,0\n',
      '192', ',0,0', '\n',
      '14', '4,', '60', ',', '127\n',
      [messageStatus(MESSAGE_NOTEON), 60, 0]
    ];
    var captured = [];
    instrument.stdout.on('data', function(chunk) {
      var capture = chunk.toString().match(/received message: ([\d,]+)/g).map(function(val) {
        return val.split(': ')[1].split(',').map(function(num) {
          return parseInt(num, 10);
        });
      });
      captured = captured.concat(capture);
      if (captured.length === 4) {
        assert.deepEqual(captured, expected);
        done();
      }
    });
    for (var i = 0; i < messages.length - 1; i++) {
      destStream.write(messages[i]);
    }
    setTimeout(function() {
      destStream.write(messages[messages.length - 1]);
    }, 2000);
  });
});