var Statum = require('../index.js');
var test = require('tape');
var is = require('functional-predicates');

test('new Statum(function)', function (t) {
  t.plan(2);

  var i = 0;
  var index = new Statum(function() { return i; });
  
  t.equal(index.value, 0);
  i++; index.refresh();
  t.equal(index.value, 1);
});

test('new Statum(function, undefined)', function (t) {
  t.plan(1);

  var name = new Statum(function() { return this; }, undefined);

  t.equal(name.value, name);
});

test('new Statum(function, context)', function (t) {
  t.plan(1);

  var ctx = { get: function() { return 'dan'; } };
  var name = new Statum(function() { return this.get(); }, ctx);

  t.equal(name.value, 'dan');
});

test('state.change(condition, function)', function (t) {
  t.plan(4);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  width.change(is.lt(100), function(res, val) {
    t.equal(val, size.width);
    t.equal(res, is.lt(100)(val));
  });

  size.width = 90; width.refresh();
  size.width = 110; width.refresh();
});

test('state.change(value, function)', function (t) {
  t.plan(6);

  var size = { width: 110 };
  var width = new Statum(function() { return size.width; });

  width.change(90, function(res, val) {
    t.equal(val, size.width);
    t.equal(res, val === 90);
  });

  size.width = 90; width.refresh();
  size.width = 110; width.refresh();
  size.width = 110; width.refresh();
});

test('state.enter(condition, function)', function (t) {
  t.plan(4);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  width.enter(is.lt(100), function(res, val) {
    t.equal(res, true);
    t.equal(val, 90);
  });

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();
});

test('state.exit(condition, function)', function (t) {
  t.plan(4);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  width.exit(is.lt(100), function(res, val) {
    t.equal(res, false);
    t.equal(val, 110);
  });

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();
});

test('state.state(condition, { enter })', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  width.state(is.lt(100), { enter: function() { counter++; } });

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();

  t.equal(counter, 2);
});

test('state.state(condition, { exit })', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  width.state(is.lt(100), { exit: function() { counter++; } });

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();

  t.equal(counter, 2);
});

test('state.state(condition, { change })', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  width.state(is.lt(100), { change: function() { counter++; } });

  size.width = 110; width.refresh();
  size.width = 105; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();

  t.equal(counter, 4);
});

test('state.state(condition, { refresh })', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  width.state(is.lt(100), { refresh: function() { counter++; } });

  size.width = 110; width.refresh();
  size.width = 105; width.refresh();
  size.width = 90; width.refresh();
  size.width = 110; width.refresh();

  t.equal(counter, 5);
});

test('state.state(condition, enter, exit)', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  width.state(is.lt(100), function() { counter += 10; }, function() { counter += 1; });

  size.width = 110; width.refresh(); // 11
  size.width = 90; width.refresh(); // 21
  size.width = 110; width.refresh(); // 22

  t.equal(counter, 22);
});

test('state.off(condition, cb)', function (t) {
  t.plan(2);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  var isLt100 = is.lt(100);
  var count = function() { counter++; };
  var count2 = function() { counter++; };

  width.change(isLt100, count);
  width.change(isLt100, count2);
  t.equal(counter, 2);
  width.off(isLt100, count);

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();

  t.equal(counter, 4);
});


test('state.off(condition)', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  var isLt100 = is.lt(100);
  var count = function() { counter++; };
  var count2 = function() { counter++; };

  width.change(isLt100, count);
  width.change(isLt100, count2);
  width.off(isLt100);

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();

  t.equal(counter, 2);
});


test('state.off()', function (t) {
  t.plan(1);

  var size = { width: 90 };
  var width = new Statum(function() { return size.width; });

  var counter = 0;
  var isLt100 = is.lt(100);
  var count = function() { counter++; };
  var count2 = function() { counter++; };

  width.change(isLt100, count);
  width.change(isLt100, count2);
  width.off();

  size.width = 110; width.refresh();
  size.width = 90; width.refresh();

  t.equal(counter, 2);
});