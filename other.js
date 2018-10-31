
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
