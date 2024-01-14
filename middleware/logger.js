// Logging middleware


// @desc    Logs requests to console
const logger = (req, res, next)=>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next(); // in every middleware piece, to move to the next thing in the cycle
  }

  module.exports = logger;