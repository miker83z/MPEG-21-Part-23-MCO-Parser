const { addElement } = require('../../../generators/lib/AddElement');
const generators = require('../../../generators/');
const { addToObjectsSet, getType, parsed } = require('../Utils');
const lut = require('../../../lookup-tables/');

const handleTextClause = (
  jsonLDGraph,
  mediaContractualObjects,
  classData,
  element,
  parentContractId
) => {
  if (parsed(mediaContractualObjects, element)) return;
  // generate a text clause object
  const textClauseObj = generators.generateTextClause(classData, element);
  // save the object
  addToObjectsSet(
    mediaContractualObjects,
    textClauseObj.identifier,
    textClauseObj
  );

  // update contract
  const referencedContract = mediaContractualObjects[parentContractId];
  addElement(
    { textClauses: 'array' },
    referencedContract,
    'textClauses',
    textClauseObj.identifier
  );
};

module.exports = { handleTextClause };
