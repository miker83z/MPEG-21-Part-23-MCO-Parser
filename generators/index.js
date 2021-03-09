const Action = require('./lib/Action.js');
const Contract = require('./lib/Contract.js');
const Fact = require('./lib/Fact.js');
const Interval = require('./lib/Interval.js');
const IPEntity = require('./lib/IPEntity.js');
const MCODeonticExpression = require('./lib/MCODeonticExpression.js');
const Party = require('./lib/Party.js');
const Service = require('./lib/Service.js');
const TextClause = require('./lib/TextClause.js');
const Timeline = require('./lib/Timeline.js');
const Track = require('./lib/Track.js');

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
