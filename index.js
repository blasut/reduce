// Helpers
function add(sum, x) { return sum + x; }
function concat(coll, x) { return coll.concat(x); }
function reverse(coll, x) { return [x].concat(coll); }
function identity_reduce_args(coll, x, index, org_coll) { console.log("ID", "coll", coll, "x", x, "index", index, "org_coll", org_coll); return x; }
function identity(x) { return x; }
function odd(x) { return x % 2 !== 0; }
function first(c) { return c[0]; }
function rest(c) { return c.slice(1); }

// Reduce
function reduce_imp(list, fn, start) {
  console.log("start", start, "list", list, "fn", fn);
  var first = list[0];
  var accumulator = fn.apply(null, [start, first, 0, list]);
  console.log("accumulator", accumulator);

  for(var i = 1; i < list.length; i++) {
    var newVal = fn.apply(null, [accumulator, list[i], i, list]);
    console.log("newVal", newVal);
    accumulator = newVal;
  }
  return accumulator;
}
function reduce(list, fn, start) {
  if (list.length == 0) { return start; }

  var accumulator = fn.apply(null, [start, first(list)]);

  return reduce(rest(list), fn, accumulator);
}

// just putting a name on it
function group_by(coll, f) {
  return reduce([0,1,2,3], function(coll, x, index) {
    var toBeKey = f(x);
    var def = [];
    if(coll[toBeKey]) {
      def = coll[toBeKey];
    }
    coll[toBeKey] = [x].concat(def);
    return coll;
  }, {});
}

function group_by_examples() {
  // group by?
  // hardcoded fn in reduce
  reduce([0,1,2,3], function(coll, x, index) {
    var toBeKey = odd(x);
    var def = [];
    if(coll[toBeKey]) {
      def = coll[toBeKey];
    }
    coll[toBeKey] = [x].concat(def);
    return coll;
  }, {});


  // group-by: f coll
  // using anon functions
  (function(f) {
    return reduce([0,1,2,3], function(coll, x, index) {
      var toBeKey = f(x);
      var def = [];
      if(coll[toBeKey]) {
        def = coll[toBeKey];
      }
      coll[toBeKey] = [x].concat(def);
      return coll;
    }, {});
  }(odd));


}


// tests
function is(expected,actual) {
  if(expected !== actual) {
    console.error("Test failed: ", expected, " !== ", actual);
  }
}

function test() {
  is(3, reduce([0,1,2], add, 0));
  is(3, reduce([1,2], add, 0));
  reduce([1,2,3], concat, []);
  reduce([1,2,3], reverse, []);
  reduce([1,2,3], identity_reduce_args, []);
  group_by([0,1,2,3], odd);
}
test();
