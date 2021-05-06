const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Party');

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

const generateParty = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = partyObj;

  if (classData.length > 1) {
    obj.class = classData[1];
    switch (classData[1]) {
      case 'MCOUser':
        modelObj = userObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'role', classData[2]);
        }
        break;
      case 'Organization':
        modelObj = organizationObj;
        break;
      default:
        break;
    }
  }

  Object.keys(payload).forEach((k) => {
    if (lut[k] !== undefined) addElement(modelObj, obj, lut[k], payload[k], k);
    else if (k !== '@type')
      addElement(modelObj, obj, 'metadata', payload[k], k);
  });

  return obj;
};

module.exports = { generateParty };
