const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');

const handleTimeline = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a timeline object
  const timelineObj = generators.generateTimeline(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, timelineObj.identifier, timelineObj);

  /* not update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { objects: 'array' },
    referencedContract,
    'objects',
    timelineObj.identifier
  );*/
};

module.exports = { handleTimeline };
