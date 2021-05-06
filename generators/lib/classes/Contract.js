const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Contract');

const contractObj = {
  identifier: 'string',
  metadata: 'map',
  governingLaw: 'string',
  court: 'string',
  isCourtJurisdictionExclusive: 'boolean',
  textVersion: 'string',
  encryptedTextVersion: 'string',
  contractRelations: 'map',
  parties: 'array',
  otherPersonUsers: 'array',
  deontics: 'array',
  actions: 'array',
  objects: 'array',
  signatories: 'array',
};

const generateContract = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = contractObj;

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type')
      addElement(modelObj, obj, 'metadata', payload[k], k);
  });

  return obj;
};

module.exports = { generateContract };
