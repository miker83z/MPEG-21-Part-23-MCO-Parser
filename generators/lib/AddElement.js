const addElement = (modelObj, obj, key, value, origKey) => {
  if (modelObj[key] === undefined)
    throw new Error('Generation error, key:' + key);
  else {
    switch (modelObj[key]) {
      case 'string':
        obj[key] = value;
        break;
      case 'array':
        if (obj[key] === undefined) obj[key] = [];
        if (value instanceof Array)
          value.forEach((v) => obj[key].push(v['@id']));
        else obj[key].push(value);
        break;
      case 'map':
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
        break;
    }
  }
};

module.exports = { addElement };
