const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Track');

const timelineObj = {
  identifier: 'string',
  extra: 'map',
};

const generateTimeline = (classData, payload) => {
  const obj = {};
  let modelObj = timelineObj;

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type') addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateTimeline };
