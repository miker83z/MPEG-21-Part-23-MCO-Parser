// To avoid module exports inside circular dependency
const { handleParty } = require('./commonHandlers');

module.exports = { handleParty };
