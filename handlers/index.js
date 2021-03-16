const Action = require('./lib/classes/Action.js');
const Contract = require('./lib/classes/Contract.js');
const Fact = require('./lib/classes/Fact.js');
const Interval = require('./lib/classes/Interval.js');
const IPEntity = require('./lib/classes/IPEntity.js');
const MCODeonticExpression = require('./lib/classes/MCODeonticExpression.js');
const Party = require('./lib/classes/Party.js');
const Service = require('./lib/classes/Service.js');
const TextClause = require('./lib/classes/TextClause.js');
const Timeline = require('./lib/classes/Timeline.js');
const Track = require('./lib/classes/Track.js');

module.exports = {
  ...Action,
  ...Contract,
  ...Fact,
  ...Interval,
  ...IPEntity,
  ...MCODeonticExpression,
  ...Party,
  ...Service,
  ...TextClause,
  ...Timeline,
  ...Track,
};
