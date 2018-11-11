
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

console.log("either", Either(1,2));
console.log("either", Either(1,2).map(inc));

function object_either_test() {

  console.log("Tests ran in object either")
}

object_either_test();
