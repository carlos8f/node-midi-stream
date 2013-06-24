// (make sure a midi controller is connected)

var input = require('../').readable(0);
input.pipe(process.stdout);
