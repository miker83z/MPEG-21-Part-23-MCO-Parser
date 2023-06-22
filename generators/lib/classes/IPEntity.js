const { addElement } = require('../AddElement');
const { IPEntity: lut } = require('../../../lookup-tables');
const { ipentityObj, segmentObj } = require('../types/IPEntity');

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
      case 'Data':
        obj.class = classData[classData.length - 1];
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
