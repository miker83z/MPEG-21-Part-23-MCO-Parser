const parseTTL = require('@frogcat/ttl2jsonld').parse;
const fs = require('fs');
const lut = require('./lookup-tables/');
const { handleContract, handleMCODeonticExpression } = require('./handlers/');
const { getType } = require('./handlers/lib/Utils');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [{ name: 'contract', alias: 'c', type: String }];
const options = commandLineArgs(optionDefinitions);

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

const contractPath = options.contract;

const ttl = fs.readFileSync(contractPath, 'utf-8');
console.log(getContractFromMCO(ttl));
