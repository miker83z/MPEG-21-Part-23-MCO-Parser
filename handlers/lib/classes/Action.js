const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleParty } = require('./Party');

const handleAction = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a party object
  const actionObj = generators.generateAction(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, actionObj.identifier, actionObj);
  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { actions: 'array' },
    referencedContract,
    'actions',
    actionObj.identifier
  );
  // update party
  const partyEle = jsonLDGraph[actionObj.actedBy];
  const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
  handleParty(
    jsonLDGraph,
    mediaContractualObjects,
    partyClassData,
    partyEle,
    parentContractId
  );
  const referencedParty = mediaContractualObjects[actionObj.actedBy];
  addElement(
    { actionsIsSubject: 'array' },
    referencedParty,
    'actionsIsSubject',
    actionObj.identifier
  );

  // traverse related elements
  if (actionObj.impliesAlso !== undefined) {
    actionObj.impliesAlso.forEach((actId) => {
      const actEle = jsonLDGraph[actId];
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
  if (actionObj.rightGivenBy !== undefined) {
    actionObj.rightGivenBy.forEach((partyId) => {
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
  if (actionObj.recipients !== undefined) {
    actionObj.recipients.forEach((partyId) => {
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
  if (actionObj.beneficiaries !== undefined) {
    actionObj.beneficiaries.forEach((partyId) => {
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
  if (actionObj.incomeSources !== undefined) {
    actionObj.incomeSources.forEach((actId) => {
      const actEle = jsonLDGraph[actId];
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
  if (actionObj.isAbout !== undefined) {
    actionObj.isAbout.forEach((actId) => {
      const actEle = jsonLDGraph[actId];
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
};

module.exports = { handleAction };
