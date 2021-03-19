const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleIPEntity } = require('./IPEntity');
const { handleParty } = require('./Party');
const { handleTextClause } = require('./TextClause');
const { handleFact } = require('./Fact');

const handleMCODeonticExpression = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a deontic object
  const deonticObj = generators.generateMCODeonticExpression(
    classData,
    element
  );
  // save the object
  addToObjectsSet(mediaContractualObjects, deonticObj.identifier, deonticObj);

  // update contract
  const referencedContract = mediaContractualObjects[deonticObj.issuedIn];
  addElement(
    { deontics: 'array' },
    referencedContract,
    'deontics',
    deonticObj.identifier
  );
  // update party issuer
  const partyEle = jsonLDGraph[deonticObj.issuer];
  const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
  handleParty(
    jsonLDGraph,
    mediaContractualObjects,
    partyClassData,
    partyEle,
    deonticObj.issuedIn
  );
  const referencedParty = mediaContractualObjects[deonticObj.issuer];
  addElement(
    { deonticsIssued: 'array' },
    referencedParty,
    'deonticsIssued',
    deonticObj.identifier
  );
  //generate action
  if (deonticObj.act !== undefined) {
    const actEle = jsonLDGraph[deonticObj.act];
    const actClassData = lut.AllClasses[getType(actEle).toLowerCase()];
    handleAction(
      jsonLDGraph,
      mediaContractualObjects,
      actClassData,
      actEle,
      deonticObj.issuedIn
    );
    // update from action
    const actionObj = mediaContractualObjects[actEle['@id']];
    addElement(
      { actedBySubject: 'string' },
      deonticObj,
      'actedBySubject',
      actionObj.actedBy
    );
    if (actionObj.actedOver !== undefined) {
      //TODO SERVICE
      actionObj.actedOver.forEach((ipentityId) => {
        addElement(
          { actObjects: 'array' },
          deonticObj,
          'actObjects',
          ipentityId
        );
        const ipentityEle = jsonLDGraph[ipentityId];
        const ipentityClassData =
          lut.AllClasses[getType(ipentityEle).toLowerCase()];
        handleIPEntity(
          jsonLDGraph,
          mediaContractualObjects,
          ipentityClassData,
          ipentityEle,
          deonticObj.issuedIn
        );
      });
    }
    if (actionObj.resultsIn !== undefined) {
      actionObj.resultsIn.forEach((ipentityId) => {
        addElement(
          { resultantObject: 'array' },
          deonticObj,
          'resultantObject',
          ipentityId
        );
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
  }

  // traverse related elements
  if (deonticObj.textClauses !== undefined) {
    deonticObj.textClauses.forEach((textClauseId) => {
      const textClauseEle = jsonLDGraph[textClauseId];
      const textClauseClassData =
        lut.AllClasses[getType(textClauseEle).toLowerCase()];
      handleTextClause(
        jsonLDGraph,
        mediaContractualObjects,
        textClauseClassData,
        textClauseEle,
        parentContractId
      );
    });
  }
  if (deonticObj.constraints !== undefined) {
    deonticObj.constraints.forEach((factId) => {
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
};

// this is here to avoid circular dependency
const handleAction = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate an action object
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
  if (actionObj.sellsDeontic !== undefined) {
    const deonticEle = jsonLDGraph[deonticObj.signatory];
    const deonticClassData = lut.AllClasses[getType(deonticEle).toLowerCase()];
    mcoD.handleMCODeonticExpression(
      jsonLDGraph,
      mediaContractualObjects,
      deonticClassData,
      deonticEle
    );
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

module.exports = { handleMCODeonticExpression, handleAction };
