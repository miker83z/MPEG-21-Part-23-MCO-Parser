const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');

const handleFact = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a fact object
  const factObj = generators.generateFact(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, factObj.identifier, factObj);

  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { objects: 'array' },
    referencedContract,
    'facts',
    factObj.identifier
  );

  // traverse related elements
  if (factObj.composedFacts !== undefined) {
    factObj.composedFacts.forEach((factId) => {
      const factEle = jsonLDGraph[factId];
      const factClassData = lut.AllClasses[getType(factEle).toLowerCase()];
      handleFact(
        jsonLDGraph,
        mediaContractualObjects,
        factClassData,
        factEle,
        parentContractId
      );
    });
  }
  if (factObj.makesTrue !== undefined) {
    // TODO EVENT
    factObj.makesTrue.forEach((actionId) => {
      const actEle = jsonLDGraph[actionId];
      const actClassData = lut.AllClasses[getType(actEle).toLowerCase()];
      handleAction(
        jsonLDGraph,
        mediaContractualObjects,
        actClassData,
        actEle,
        parentContractId
      );
    });
  }
  if (factObj.withIPEntity !== undefined) {
    const ipentityEle = jsonLDGraph[factObj.withIPEntity];
    const ipentityClassData =
      lut.AllClasses[getType(ipentityEle).toLowerCase()];
    handleIPEntity(
      jsonLDGraph,
      mediaContractualObjects,
      ipentityClassData,
      ipentityEle,
      parentContractId
    );
  }
  if (factObj.partOf !== undefined) {
    factObj.partOf.forEach((ipentityId) => {
      const ipentityEle = jsonLDGraph[ipentityId];
      const ipentityClassData =
        lut.AllClasses[getType(ipentityEle).toLowerCase()];
      handleIPEntity(
        jsonLDGraph,
        mediaContractualObjects,
        ipentityClassData,
        ipentityEle,
        parentContractId
      );
    });
  }
};

module.exports = { handleFact };
