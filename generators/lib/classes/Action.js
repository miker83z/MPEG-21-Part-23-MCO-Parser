const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Action');

const actionObj = {
  identifier: 'string',
  type: 'string',
  impliesAlso: 'array',
  resultsIn: 'array',
  rightGivenBy: 'array',
  actedBy: 'string',
  actedOver: 'array',
};
const tradeObj = {
  ...actionObj,
  sellsDeontic: 'string',
};
const provideObj = {
  ...actionObj,
  isOnLoan: 'boolean',
  recipients: 'array',
};
const paymentObj = {
  ...actionObj,
  beneficiaries: 'array',
  incomeSources: 'array',
  amount: 'number',
  currency: 'string',
  incomePercentage: 'number',
};
const notifyObj = {
  ...actionObj,
  recipients: 'array',
  isAbout: 'array',
};

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
      default:
        break;
    }
  }
  addElement(modelObj, obj, 'type', actionType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type') console.log('Warning! Left out:' + payload[k]); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateAction };
