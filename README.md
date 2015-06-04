# Statum

```js
var komposit = require('komposit');
var grab = require('date-grab');
var is = require('functional-predicates');

var time = new Statum(function() { return new Date(); });
setInterval(time.refresh, 1000);

var isAfterNoon = komposit(grab('hours'), is.lt(12));

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
```