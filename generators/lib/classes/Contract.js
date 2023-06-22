const { addElement } = require('../AddElement');
const { Contract: lut } = require('../../../lookup-tables');
const { contractObj } = require('../types/Contract');

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
