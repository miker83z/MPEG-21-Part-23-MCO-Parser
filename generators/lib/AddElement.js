const addElement = (modelObj, obj, key, value, origKey) => {
  if (modelObj[key] === undefined)
    throw new Error('Generation error, key:' + key);
  else {
    switch (modelObj[key]) {
      case 'string':
        obj[key] = getStringOrObject(value);
        break;
      case 'array':
        if (obj[key] === undefined) obj[key] = [];
        if (value instanceof Array)
          value.forEach((v) => obj[key].push(getStringOrObject(v)));
        else obj[key].push(getStringOrObject(value));
        break;
      case 'map':
        if (key instanceof Array && key.length > 1) {
          key = key[0];
          origKey = key[1];
        }
        if (obj[key] === undefined) obj[key] = {};
        obj[key][origKey] = value;
        break;
      case 'boolean':
        obj[key] = value === 'true' || value === 'True';
        break;
      case 'number':
        obj[key] = Number(value);
        break;
      default:
        throw new Error('Generation error');
    }
  }
};

const getStringOrObject = (value) => {
  switch (typeof value) {
    case 'string':
      return value;
      break;
    case 'object':
      return value['@id'];
    default:
      throw new Error('Generation error');
      break;
  }
};

module.exports = { addElement };
