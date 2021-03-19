const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');
const { handleParty } = require('./Party');
const { handleInterval } = require('./Interval');
const { handleTrack } = require('./Track');

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

module.exports = { handleIPEntity };
