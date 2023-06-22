const { addElement } = require('../AddElement');
const { Action: lut } = require('../../../lookup-tables');
const {
  actionObj,
  tradeObj,
  provideObj,
  paymentObj,
  notifyObj,
  processingObj,
} = require('../types/Action');

const generateAction = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = actionObj;
  let actionType = 'Simple';

  if (classData.length > 1) {
    obj.class = classData[1];
    actionType = classData[1];
    switch (classData[1]) {
      case 'Trade':
        modelObj = tradeObj;
        break;
      case 'Provide':
        modelObj = provideObj;
        break;
      case 'Payment':
        modelObj = paymentObj;
        break;
      case 'Notify':
        modelObj = notifyObj;
        break;
      case 'Processing':
        obj.class = classData[classData.length - 1];
        break;
      default:
        break;
    }
  }
  addElement(modelObj, obj, 'type', actionType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type')
      console.log('Warning! Left out:' + payload[k] + ', because:' + k); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateAction };
