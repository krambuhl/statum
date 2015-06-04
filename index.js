function Statum(refresher, ctx) {
  this._states = [];
  this.setRefresher(refresher);
  this.setContext(ctx);
  this.refresh();
}

Statum.prototype = {
  setRefresher: function(ref) { this.refresher = ref; },
  setContext: function(ctx) { this.context = ctx; },
  refresh: function() {
    this.prevValue = this.value;
    this.value = this.refresher.call(this.context);
    this.testStates();
  },

  testStates: function() {
    this._states.forEach(this.testState, this);
  },

  testState: function(state) {
    var res = state.test.call(this.context, this.value);
    if (res !== state.result) {
      state.result = res;

      if (state.type === 'enter' && res !== true) return;
      if (state.type === 'exit' && res !== false) return;
      
      state.cb.call(this.context, res, this.value);
    }
  },

  createState: function(type, cond, cb) {
    return { 
      type: type,
      cond: cond,
      test: typeof cond !== 'function' ? function(val) {
        return cond === val;
      } : cond,
      cb: cb
    };
  },

  state: function(cond, config) {
    if (arguments.length > 2) 
      this.state(cond, { enter: arguments[1], exit: arguments[2] });

    for(var type in config) {
      var state = this.createState(type, cond, config[type]);
      this.testState(state);
      this._states.push(state);
    }
  },

  change: function(cond, cb) { this.state(cond, { change: cb }); },
  enter: function(cond, cb) { this.state(cond, { enter: cb }); },
  exit: function(cond, cb) { this.state(cond, { exit: cb }); },
  off: function(cond, cb) {
    this._states = this._states.filter(function(state) {
      return !eq(state.cond, cond) && !eq(state.cb, cb);
    });
  }
};

function eq(state, loc) { return loc !== undefined && state === loc; }

module.exports = Statum;