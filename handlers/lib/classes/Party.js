const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleIPEntity } = require('./IPEntity');

const handleParty = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a party object
  const partyObj = generators.generateParty(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, partyObj.identifier, partyObj);

  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  if (
    !referencedContract.parties.includes(partyObj.identifier) &&
    classData[1] === 'MCOUser'
  ) {
    addElement(
      { otherPersonUsers: 'array' },
      referencedContract,
      'otherPersonUsers',
      partyObj.identifier
    );
  }

  // traverse related elements
  if (partyObj.actOnBehalfOf !== undefined) {
    partyObj.actOnBehalfOf.forEach((partyId) => {
      const partyEle = jsonLDGraph[partyId];
      const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
      handleParty(
        jsonLDGraph,
        mediaContractualObjects,
        partyClassData,
        partyEle,
        parentContractId
      );
    });
  }
  if (partyObj.belongsToCollective !== undefined) {
    partyObj.actOnBehalfOf.forEach((partyId) => {
      const partyEle = jsonLDGraph[partyId];
      const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
      handleParty(
        jsonLDGraph,
        mediaContractualObjects,
        partyClassData,
        partyEle,
        parentContractId
      );
    });
  }
  if (partyObj.isRightsOwnerOf !== undefined) {
    partyObj.isRightsOwnerOf.forEach((ipentityId) => {
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
  if (partyObj.signatory !== undefined) {
    const partyEle = jsonLDGraph[partyObj.signatory];
    const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
    handleParty(
      jsonLDGraph,
      mediaContractualObjects,
      partyClassData,
      partyEle,
      parentContractId
    );
  }
};

module.exports = { handleParty };
