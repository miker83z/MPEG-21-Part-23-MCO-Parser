const { addElement } = require('./AddElement');
const lut = require('../../lookup-tables/lib/Party');

const partyObj = {
  identifier: 'string',
  metadata: 'map',
  name: 'string',
  details: 'map',
  address: 'string',
  deonticsIssued: 'array',
  actionsIsSubject: 'array',
  belongsToCollective: 'array',
  signature: 'string',
};
const userObj = {
  ...partyObj,
  role: 'string',
  signature: 'string',
  socialTag: 'string',
  actOnBehalfOf: 'array',
  isRightsOwnerOf: 'array',
};
const organizationObj = {
  ...partyObj,
  signatory: 'string',
};

const generateParty = (classData, payload) => {
  const obj = {};
  let modelObj = partyObj;

  if (classData.length > 1)
    switch (classData[1]) {
      case 'MCOUser':
        modelObj = userObj;
        if (classData.length > 2)
          addElement(modelObj, obj, 'role', classData[2]);
        break;
      case 'Organization':
        modelObj = organizationObj;
        break;
      default:
        throw new Error('Party generation error');
        break;
    }

  Object.keys(payload).forEach((k) => {
    if (lut[k] !== undefined) addElement(modelObj, obj, lut[k], payload[k], k);
    else addElement(modelObj, obj, 'details', payload[k], k);
  });

  return obj;
};

module.exports = { generateParty };
