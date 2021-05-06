const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/IPEntity');

const ipentityObj = {
  identifier: 'string',
  type: 'string',
  metadata: 'map',
  socialTag: 'string',
  isDigital: 'boolean',
  rightsOwners: 'array',
  isMadeUpOf: 'array',
  resultedFrom: 'array',
  isAudio: 'boolean',
  segments: 'array',
  tracks: 'array',
  interval: 'array',
  extra: 'map',
};
const segmentObj = {
  ...ipentityObj,
  segmentOf: 'string',
  contains: 'array',
  onTrack: 'array',
};

const generateIPEntity = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = ipentityObj;
  let ipentityType = 'Simple';

  if (classData.length > 1) {
    obj.class = classData[1];
    ipentityType = classData[1];
    switch (classData[1]) {
      case 'Segment':
        modelObj = segmentObj;
        break;
      default:
        break;
    }
  }
  addElement(modelObj, obj, 'type', ipentityType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type')
      addElement(modelObj, obj, 'metadata', payload[k], k);
  });

  return obj;
};

module.exports = { generateIPEntity };
