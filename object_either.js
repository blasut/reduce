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
    console.error("Test failed: ", expected, " not eq ", actual);
  }
}
function reduce(fn, accumulator, collection) {
  for (const thing of collection) {
    accumulator = fn(accumulator, thing);
  }

  return accumulator;
}
function compose(/* functions */) {
  var args = [].slice.call(arguments).reverse();
  return function (x) {
    return reduce(function (acc, fn) {
      return fn(acc)
    }, x, args)
  }
}

function Maybe(val) {
  if ( !(this instanceof Maybe) )
    return new Maybe(val);

  this.val = val;
}

Maybe.prototype.map = function(f) {
  return this.val ? Maybe(f(this.val)) : Maybe(null);
}

function Either(left, right) {
  if ( !(this instanceof Either) )
    return new Either(left, right);

  this.left = left;
  this.right = right;
}

Either.prototype.map = function(f) {
  return this.right ?
    Either(this.left, f(this.right)) :
    Either(f(this.left), null);
}



function Validation(msg, x) {
  if ( !(this instanceof Validation) )
    return new Validation(msg, x);

  this.msg = msg;
  this.x = x;
}

Validation.prototype.map = function(f) {
  return this.right ?
    Validation(this.left, f(this.right)) :
    Validation(this.left, null);
}

// skipping the function on the left case?
const Failure = (msg) => ({ Failure: msg });
const Success = (x)   => ({ Success: x });

// validate using Either:
const validate = (predicate, msg) => (x) => {
  if(predicate(x)) {
    return Success(x)
  } else {
    return Failure(msg)
  }
}


const get = (path) => (x) => ( x[path] )

// todo: complement
const equal = (a) => (b) => ( a === b )
const notEqual = (a) => (b) => ( a !== b )

const validateEmail = validate(compose(notEqual(""), get("email")),
                               "Email must not be blank");

const maybeSkip = (fn) => (eitherInput) => {
  if(eitherInput.Failure) {
    return eitherInput;
  } else {
    return fn(eitherInput.Success);
  }
}

function fmap(fn, thing) {
  // if the thing has a .map use that!
  if(thing.map !== undefined) {
    return thing.map(fn)
  } else {
    return thing;
  }
}

function map(fn, collection) {
  return reduce(function (accumulator, item) {
    return accumulator.concat(fn(item));
  }, [], collection)
}

const makeInput = (name = "", email = "") => ({
  name,
  email
})

function object_either_test() {
  console.group("Maybe")

  console.log(Maybe(1))
  console.log(Maybe(null))

  eq(Maybe(2), fmap(inc, Maybe(1)))
  eq(Maybe(null), fmap(inc, Maybe(null)))

  console.groupEnd()

  console.group("Either")
  console.log("either", Either(1,2));
  console.log("either", Either(1,2).map(inc));

  eq(Either(1,3), Either(1,2).map(inc))

  eq(fmap(inc, Either(1,2)), Either(1,3))
  eq(fmap(inc, Either(1,null)), Either(2,null))

  eq({ Failure: "Email must not be blank" }, validateEmail(makeInput()))

  console.groupEnd()

  console.log("Tests ran in object either")
}

object_either_test();
