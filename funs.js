console.log('funs');

console.log("ramda", R)

// Just :: a -> Maybe a
// Nothing :: () -> Maybe a


console.log(reduce);

// Helpers
const Failure = (msg) => ({ Failure: msg });
const Success = (x)   => ({ Success: x });
const lift    = (fn)  => (x) => ( Success(fn(x)) )

const composeK = (fn1, fn2) => (x) => {
  const res = fn1(x);
  if(res.Failure) {
    return res;
  } else {
    return fn2(res.Success);
  }
}
const bind = (fn) => (eitherInput) => {
  if(eitherInput.Failure) {
    return eitherInput;
  } else {
    return fn(eitherInput.Success);
  }
}



// Validators
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

function validateLength(input) {
  if(input.email.length > 5) {
    return Failure("Email must not be longer than 5 chars")
  } else {
    return Success(input)
  }
}

function validateName(input) {
  if(input.name == "") {
    return Failure("Name must not be blank")
  } else {
    return Success(input)
  }
}

// Others
const fixEmail = (input) => {
  return {
    name: input.name,
    email: input.email.trim().toLowerCase()
  }
}

function combinedValidation(input) {
  let validateNameEither = validateName;
  let validateEmailEither = bind(validateEmail);
  let validateLengthEither = bind(validateLength);

  return validateLengthEither(
    validateEmailEither(
      validateNameEither(input)
    )
  )
}

const combinedValidationPointFree = compose(
  bind( validateLength ),
  bind( validateEmail ),
  validateName
);

function useCase(input) {
  return composeK(
    lift(fixEmail),
    combinedValidationPointFree)(input);
}

const useCasePointfree = composeK(
  lift(fixEmail),
  combinedValidationPointFree
);

const makeInput = (name = "", email = "") => ({
  name,
  email
})

function test() {
  eq({ Failure: "Name must not be blank" }, combinedValidation(makeInput()))
  eq({ Failure: "Email must not be blank" }, combinedValidation(makeInput("Lau")))
  eq({ Failure: "Email must not be longer than 5 chars" }, combinedValidation(makeInput("Lau", "emaila")))

  eq({ Success: { name: "Lau", email: "email"}}, combinedValidation(makeInput("Lau", "email")))

  eq({ Success: { name: "Lau", email: "email"}}, useCase(makeInput("Lau", "EMAIL")))

  console.log("Tests ran in funs")
}
                      test();
