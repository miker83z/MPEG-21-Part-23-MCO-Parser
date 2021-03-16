const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleParty } = require('./Party');

const handleContract = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element
) => {
  // generate a contract object
  const contractObj = generators.generateContract(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, contractObj.identifier, contractObj);
  // generate all the contract's party objects
  if (contractObj.parties !== undefined) {
    // search for all parties
    contractObj.parties.forEach((partyId) => {
      const partyEle = jsonLDGraph[partyId];
      const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
      handleParty(
        jsonLDGraph,
        mediaContractualObjects,
        partyClassData,
        partyEle,
        contractObj.identifier
      );
    });
  }
};

module.exports = { handleContract };
