const parseTTL = require('@frogcat/ttl2jsonld').parse;
const fs = require('fs');
const lut = require('./lookup-tables/');
const generators = require('./generators/');

const generator = (classData, payload) => {
  switch (classData[0]) {
    case 'Action':
      return generators.generateAction(classData, payload);
    case 'Contract':
      return generators.generateContract(classData, payload);
    case 'Fact':
      return generators.generateFact(classData, payload);
    case 'Interval':
      return generators.generateInterval(classData, payload);
    case 'IPEntity':
      return generators.generateIPEntity(classData, payload);
    case 'MCODeonticExpression':
      return generators.generateMCODeonticExpression(classData, payload);
    case 'Party':
      return generators.generateParty(classData, payload);
    case 'Service':
      return generators.generateService(classData, payload);
    case 'TextClause':
      return generators.generateTextClause(classData, payload);
    case 'Timeline':
      return generators.generateTimeline(classData, payload);
    case 'Track':
      return generators.generateTrack(classData, payload);
    default:
      throw new Error('Generator Error: ', classData);
  }
};

const ttl = fs.readFileSync('turtle/use-case-stream-small-label.ttl', 'utf-8');
const jsonld = parseTTL(ttl);

jsonld['@graph'].forEach((element) => {
  const classData =
    typeof element['@type'] === 'string'
      ? lut.Classes[element['@type'].toLowerCase()]
      : lut.Classes[element['@type'][0].toLowerCase()];
  console.log(element['@type'], ' ---> ', classData);
  console.log(generator(classData, element));
});
