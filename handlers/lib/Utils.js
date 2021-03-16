const addToObjectsSet = (objectsSet, key, value) => {
  if (objectsSet[key] === undefined) objectsSet[key] = value;
  else objectsSet[key] = { ...objectsSet[key], value };
};

const getType = (element) => {
  if (element['@type'] instanceof Array) {
    return element['@type'][0];
  } else if (typeof element['@type'] === 'string') {
    return element['@type'];
  } else {
    throw new Error('Get type error');
  }
};

const parsed = (mediaContractualObjects, element) => {
  return (
    mediaContractualObjects[element['@id']] !== undefined &&
    mediaContractualObjects[element['@id']]['identifier'] !== undefined
  );
};

module.exports = { addToObjectsSet, getType, parsed };
