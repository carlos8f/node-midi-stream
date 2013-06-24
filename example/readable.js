// (make sure a midi controller is connected on port 0)
var input = require('../').readable(0);
var es = require('event-stream');
es.pipeline(
  input,
  es.mapSync(function (e) {
    return e + '\n'
  }),
  process.stdout
);
