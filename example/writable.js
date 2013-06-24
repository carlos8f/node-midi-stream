// this example works on mac OSX:
var device = require('coremidi')();

// for another OS, make sure a midi (output) device is connected on port n, then:
// var device = require('../').writable(n)

var input = require('../').readable(0);
input.pipe(device);
