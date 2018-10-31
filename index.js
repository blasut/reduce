function add(sum, x) { return sum + x; }
function inc(x) { return x + 1; }
function concat(coll, x) { return coll.concat(x); }
function first(c) { return c[0]; }
function rest(c) { return Array.prototype.slice.call(c, 1); }
function even(x) { return x % 2 == 0; }
function is(expected,actual) {
  if(expected != actual) {
    console.error("Test failed: ", expected, " != ", actual);
  }
}
function eq(expected,actual) {
  if(JSON.stringify( expected ) != JSON.stringify( actual )) {
    console.error("Test failed: ", expected, " != ", actual);
  }
}

function reduce(fn, accumulator, list) {
  if (list.length == 0) { return accumulator; }

  var accumulated = fn.apply(null, [accumulator, first(list)]);

  return reduce(fn, accumulated, rest(list));
}

function map(fn, collection) {
  return reduce(function (accumulator, item) {
    return accumulator.concat(fn(item));
  }, [], collection)
}

function filter(pred, collection) {
  return reduce(function (accumulator, item) {
    if(pred(item)) {
      return accumulator.concat(item);
    } else {
      return accumulator;
    }
    return pred(item) ? accumulator.concat(item) : accumulator;
  }, [], collection)
}

function compose(/* functions */) {
  var args = [].slice.call(arguments);
  return function (x) {
    return reduce(function (acc, fn) {
      return fn(acc)
    }, x, args.reverse())
  }
}

function map2(fn, collection) {
  var mapper = function (coll, item) {
    return coll.concat(fn(item));
  };
  return reduce(mapper, [], collection)
}
function filter2(pred, collection) {
  return reduce(function (accumulator, item) {
    return pred(item) ? accumulator.concat(item) : accumulator;
  }, [], collection)
}

// tests

function test() {
  is(3, reduce(add, 0, [0,1,2]));
  is(3, reduce(add, 0, [1,2]));
  is(3, reduce.bind(null, add, 0)([1,2]));

  eq([2,3], map(inc, [1,2]));

  eq([2], filter(even, [1,2]));

  eq(3, compose(inc , inc)(1));
  eq(7, compose(inc
                , inc
                , inc
                , inc
                , inc
                , inc)(1));

  console.log(reduce.bind(null, add, 0))

  console.log("Tests ran")
}
test();
