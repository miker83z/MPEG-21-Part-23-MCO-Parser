const parseTTL = require('@frogcat/ttl2jsonld').parse;
const lut = require('./lookup-tables/');
const { handleContract, handleMCODeonticExpression } = require('./handlers/');
const { getType } = require('./handlers/lib/Utils');

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

  return mediaContractualObjects;
};

module.exports = { getContractFromMCO };
