// Ensure that any exceptions thrown in the async function
// are passed to the next error-handling middleware

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
