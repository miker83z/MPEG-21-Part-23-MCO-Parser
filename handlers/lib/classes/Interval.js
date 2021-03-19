const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleTimeline } = require('./Timeline');

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
  // generate timeline
  if (intervalObj.onTimeline !== undefined) {
    const timelineEle = jsonLDGraph[intervalObj.onTimeline];
    const timelineClassData =
      lut.AllClasses[getType(timelineEle).toLowerCase()];
    handleTimeline(
      jsonLDGraph,
      mediaContractualObjects,
      timelineClassData,
      timelineEle,
      parentContractId
    );
    // update from action
    const timelineObj = mediaContractualObjects[timelineEle['@id']];
    addElement(
      { onTimeline: 'string' },
      intervalObj,
      'onTimeline',
      JSON.stringify(timelineObj) //TODO tests
    );
  }
};

module.exports = { handleInterval };
