const { addElement } = require('../AddElement');
const { MCODeonticExpression: lut } = require('../../../lookup-tables');
const {
  mcoDeonticExpressionObj,
  mcoPermissionObj,
} = require('../types/MCODeonticExpression');

const generateMCODeonticExpression = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = mcoDeonticExpressionObj;
  let deonticType = 'MCODeonticExpression';

  if (classData.length > 1) {
    obj.class = classData[1];
    deonticType = classData[1];
    switch (classData[1]) {
      case 'MCOPermission':
        modelObj = mcoPermissionObj;
        break;
      default:
        break;
    }
  }
  addElement(modelObj, obj, 'type', deonticType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type')
      addElement(modelObj, obj, 'metadata', payload[k], k);
  });

  return obj;
};

module.exports = { generateMCODeonticExpression };
