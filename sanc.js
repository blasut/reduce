const {create, env} = require('sanctuary');

console.log("funs");

const S = create({
  checkTypes: process.env.NODE_ENV !== 'production',
  env: env,
});


var arr = [1,2,3]

console.log(
  S.head(arr)
)

console.log(
  S.filter (S.lt (3)) ([1, 2, 3, 4, 5])
)

