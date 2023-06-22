const partyObj = {
  identifier: 'string',
  metadata: 'map',
  name: 'string',
  details: 'map',
  address: 'string',
  deonticsIssued: 'array',
  actionsIsSubject: 'array',
  signature: 'string',
  extra: 'map',
};
const userObj = {
  ...partyObj,
  role: 'string',
  signature: 'string',
  socialTag: 'string',
  actOnBehalfOf: 'array',
  belongsToCollective: 'array',
  isRightsOwnerOf: 'array',
};
const organizationObj = {
  ...partyObj,
  signatory: 'string',
};
//personal data
const legalEntityObj = {
  ...userObj,
  ...organizationObj,
};

module.exports = { partyObj, userObj, organizationObj, legalEntityObj };
