const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/TextClause');

const textObj = {
  identifier: 'string',
  text: 'string',
  extra: 'map',
};

const generateTextClause = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = textObj;

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type') console.log('Warning! Left out:' + payload[k]); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateTextClause };
