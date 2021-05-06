const parseTTL = require('@frogcat/ttl2jsonld').parse;
const lut = require('./lookup-tables/');
const { handleContract, handleMCODeonticExpression } = require('./handlers/');
const { getType } = require('./handlers/lib/Utils');

const formatIntoMediaContractualObjects = (mediaContract) => {
  const finalMCObjects = { contracts: [] };
  // Search for all contract objects
  Object.values(mediaContract).forEach((element) => {
    if (element.class === 'Contract') {
      Object.keys(element).forEach((contractKey) => {
        if (
          element[contractKey] instanceof Array &&
          element[contractKey].length > 0
        ) {
          const temp = {};
          element[contractKey].forEach((arrayElement) => {
            temp[arrayElement] = mediaContract[arrayElement];
          });
          element[contractKey] = temp;
        }
      });
      finalMCObjects.contracts.push(element);
    }
  });

  return finalMCObjects;
};

const getContractFromMCO = (ttl) => {
  const jsonLDGraph = {};
  const mediaContractualObjects = {};
  const jsonld = parseTTL(ttl);

  jsonld['@graph'].forEach((element) => {
    jsonLDGraph[element['@id']] = element;
  });

  // Search for all contract objects
  Object.values(jsonLDGraph).forEach((element) => {
    const classData = lut.AllClasses[getType(element).toLowerCase()];
    if (classData[0] === 'Contract') {
      handleContract(jsonLDGraph, mediaContractualObjects, classData, element);
    }
  });

  // Search for all deontic expression objects
  Object.values(jsonLDGraph).forEach((element) => {
    const classData = lut.AllClasses[getType(element).toLowerCase()];
    if (classData[0] === 'MCODeonticExpression') {
      handleMCODeonticExpression(
        jsonLDGraph,
        mediaContractualObjects,
        classData,
        element
      );
    }
  });

  return formatIntoMediaContractualObjects(mediaContractualObjects);
};

module.exports = { getContractFromMCO };
