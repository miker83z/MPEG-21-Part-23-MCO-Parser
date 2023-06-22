// To avoid module exports inside circular dependency
const { handleFact } = require('./commonHandlers');

module.exports = { handleFact };
