// To avoid module exports inside circular dependency
const { handleAction } = require('./commonHandlers');

module.exports = { handleAction };
