node-midi-stream
================

Stream interface for MIDI messages

## Readable example

```
// (make sure a midi controller is connecte on port 0)
var input = require('./').readable(0);
input.pipe(process.stdout);
```

(play midi controller)

output:

```
128,65,1
144,52,4
128,52,6
144,62,6
128,62,4
144,55,1
128,55,9
144,65,6
128,65,1
144,69,9
144,52,8
144,67,22
128,69,6
128,67,2
144,65,8
128,52,1
144,59,33
128,65,9
128,59,1
224,0,63
224,0,61
224,0,60
224,0,58
224,0,57
224,0,55
224,0,54
224,0,55
224,0,57
```

## Writable example

```js
// this example works on mac OSX:
var device = require('coremidi')();

// for another OS, make sure a midi (output) device is connected on port n, then:
// var device = require('../').writable(n)

var input = require('../').readable(0);
input.pipe(device);
```

## Things that could be implemented with MIDI streams

- pipe outputs to inputs
- transpose (writable, pipe)
- play midi file (readable)
- save midi file (writable)
- computer composition (readable)
- render to mp3 (writable)
- computer analyze/visualization (writable)
