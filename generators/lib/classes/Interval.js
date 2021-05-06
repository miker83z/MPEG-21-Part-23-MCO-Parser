const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Track');

const intervalObj = {
  identifier: 'string',
  start: 'string',
  end: 'string',
  duration: 'string',
  onTimeline: 'string',
};

const generateInterval = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = intervalObj;

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type') console.log('Warning! Left out:' + payload[k]); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateInterval };
