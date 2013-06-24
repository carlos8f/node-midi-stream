// (make sure a midi controller is connected on port 0)
var input = require('../').readable(0);
input.pipe(process.stdout);
