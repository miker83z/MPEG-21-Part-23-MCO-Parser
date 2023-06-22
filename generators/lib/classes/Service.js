const { addElement } = require('../AddElement');
const { Service: lut } = require('../../../lookup-tables');
const { serviceObj } = require('../types/Service');

const generateService = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = serviceObj;
  let serviceType = 'Simple';

  if (classData.length > 1) {
    obj.class = classData[1];
    serviceType = classData[1];
  }
  addElement(modelObj, obj, 'type', serviceType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type')
      console.log('Warning! Left out:' + payload[k] + ', because:' + k); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateService };
