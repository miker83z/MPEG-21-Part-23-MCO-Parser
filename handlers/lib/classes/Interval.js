const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');

const handleInterval = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a party object
  const intervalObj = generators.generateInterval(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, intervalObj.identifier, intervalObj);

  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { objects: 'array' },
    referencedContract,
    'objects',
    intervalObj.identifier
  );
};

module.exports = { handleInterval };
