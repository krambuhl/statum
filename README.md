# Statum

Simple state machines

```js
var Statum = require('statum');

var time = new Statum(function() { return new Date(); });
setInterval(time.refresh, 1000);

function isAfterNoon(time) { return time.getHours() > 12; }

time
  .change(isAfterNoon, function() { })
  .enter(isAfterNoon, function() { })
  .exit(isAfterNoon, function() { });

time.state(isAfterNoon, {
  change: function() {},
  enter: function() {},
  exit: function() {}
});

time.state(isAfterNoon, function() {}, function() {});

time.off(isAfterNoon);
```