// To avoid module exports inside circular dependency
const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');

const { handleTextClause } = require('./TextClause');
const { handleInterval } = require('./Interval');
const { handleTrack } = require('./Track');

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

  console.log(deonticObj);

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
          deonticObj.issuedIn
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
        deonticObj.issuedIn
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
        deonticObj.issuedIn
      );
    });
  }
};

const handleIPEntity = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate an IPEntity object
  const ipentityObj = generators.generateIPEntity(classData, element);
  // save the object
  addToObjectsSet(mediaContractualObjects, ipentityObj.identifier, ipentityObj);

  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { objects: 'array' },
    referencedContract,
    'objects',
    ipentityObj.identifier
  );

  // traverse related elements
  if (ipentityObj.rightsOwners !== undefined) {
    ipentityObj.rightsOwners.forEach((partyId) => {
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
  if (ipentityObj.isMadeUpOf !== undefined) {
    ipentityObj.isMadeUpOf.forEach((ipentityId) => {
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
  if (ipentityObj.resultedFrom !== undefined) {
    ipentityObj.resultedFrom.forEach((actionId) => {
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
  if (ipentityObj.segments !== undefined) {
    ipentityObj.segments.forEach((ipentityId) => {
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
  if (ipentityObj.tracks !== undefined) {
    ipentityObj.tracks.forEach((trackid) => {
      const trackEle = jsonLDGraph[trackid];
      const trackClassData = lut.AllClasses[getType(trackEle).toLowerCase()];
      handleTrack(
        jsonLDGraph,
        mediaContractualObjects,
        trackClassData,
        trackEle,
        parentContractId
      );
    });
  }
  if (ipentityObj.intervals !== undefined) {
    ipentityObj.intervals.forEach((intervalId) => {
      const intervalEle = jsonLDGraph[intervalId];
      const intervalClassData =
        lut.AllClasses[getType(intervalEle).toLowerCase()];
      handleInterval(
        jsonLDGraph,
        mediaContractualObjects,
        intervalClassData,
        intervalEle,
        parentContractId
      );
    });
  }
  if (ipentityObj.segmentOf !== undefined) {
    const ipentityEle = jsonLDGraph[ipentityObj.segmentOf];
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
  if (ipentityObj.contains !== undefined) {
    ipentityObj.contains.forEach((ipentityId) => {
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
  if (ipentityObj.onTrack !== undefined) {
    ipentityObj.onTrack.forEach((trackid) => {
      const trackEle = jsonLDGraph[trackid];
      const trackClassData = lut.AllClasses[getType(trackEle).toLowerCase()];
      handleTrack(
        jsonLDGraph,
        mediaContractualObjects,
        trackClassData,
        trackEle,
        parentContractId
      );
    });
  }
};

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
    { facts: 'array' },
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
  // personal data
  if (factObj.hasDataController !== undefined) {
    const partyEle = jsonLDGraph[factObj.hasDataController];
    const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
    handleParty(
      jsonLDGraph,
      mediaContractualObjects,
      partyClassData,
      partyEle,
      parentContractId
    );
  }
  if (factObj.hasDataSubject !== undefined) {
    const partyEle = jsonLDGraph[factObj.hasDataSubject];
    const partyClassData = lut.AllClasses[getType(partyEle).toLowerCase()];
    handleParty(
      jsonLDGraph,
      mediaContractualObjects,
      partyClassData,
      partyEle,
      parentContractId
    );
  }
  if (factObj.hasLegalBasis !== undefined) {
    factObj.hasLegalBasis.forEach((factId) => {
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
  if (factObj.hasPersonalData !== undefined) {
    factObj.hasPersonalData.forEach((ipentityId) => {
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
  if (factObj.hasPersonalDataHandling !== undefined) {
    factObj.hasPersonalDataHandling.forEach((factId) => {
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
  if (factObj.hasProcessing !== undefined) {
    factObj.hasProcessing.forEach((factId) => {
      const actionEle = jsonLDGraph[factId];
      const actionClassData = lut.AllClasses[getType(actionEle).toLowerCase()];
      handleAction(
        jsonLDGraph,
        mediaContractualObjects,
        actionClassData,
        actionEle,
        parentContractId
      );
    });
  }
  if (factObj.hasPurpose !== undefined) {
    factObj.hasPurpose.forEach((factId) => {
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
  if (factObj.hasRecipient !== undefined) {
    factObj.hasRecipient.forEach((factId) => {
      const partyEle = jsonLDGraph[factId];
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
  if (factObj.hasRight !== undefined) {
    factObj.hasRight.forEach((factId) => {
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
  if (factObj.hasRisk !== undefined) {
    factObj.hasRisk.forEach((factId) => {
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
  if (factObj.hasTechnicalOrganisationalMeasure !== undefined) {
    factObj.hasTechnicalOrganisationalMeasure.forEach((factId) => {
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
  if (actionObj.actedBy !== undefined) {
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
  }

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

module.exports = {
  handleMCODeonticExpression,
  handleIPEntity,
  handleParty,
  handleFact,
  handleAction,
};
