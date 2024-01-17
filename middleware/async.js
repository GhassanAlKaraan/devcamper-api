// This is a higher-order function, meaning it takes a function as an argument and returns a new function.
// The purpose of asyncHandler is to wrap an asynchronous function (fn) in order to handle any errors that it might throw.

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// In summary, asyncHandler is a utility function that simplifies error handling for asynchronous operations in Express routes and middleware.
// By wrapping async functions with asyncHandler, you ensure that any thrown errors are properly forwarded to Express's error handling mechanisms, without the need to explicitly write try-catch blocks in every asynchronous route or middleware.
