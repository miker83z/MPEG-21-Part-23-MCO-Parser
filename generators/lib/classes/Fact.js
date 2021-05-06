const { addElement } = require('../AddElement');
const lut = require('../../../lookup-tables/lib/classes/Action');

const factObj = {
  identifier: 'string',
  type: 'string',
  isTrue: 'boolean',
};
const factCompositionObj = {
  ...factObj,
  compositionType: 'string',
  composedFacts: 'array',
};
const actionEventFactObj = {
  ...factObj,
  validity: 'string',
  withDelay: 'string',
  status: 'string',
  makesTrue: 'array',
};
const togetherWithObj = {
  ...factObj,
  withIPEntity: 'string',
};
const onlyRestrictionObj = {
  ...factObj,
  restriction: 'string',
};
const ipentityContextObj = {
  ...factObj,
  partOf: 'array',
};
const languageObj = {
  ...factObj,
  languages: 'array',
};
const lengthObj = {
  ...factObj,
  maxLength: 'string',
};
const materialFormatObj = {
  ...factObj,
  matchesFormatComplianceProfile: 'string',
  aspectRatio: 'string',
  audioFormat: 'string',
  format: 'string',
  maxBitrate: 'number',
  maxLines: 'number',
  minBitrate: 'number',
  minLines: 'number',
  videoFormat: 'string',
};
const runsObj = {
  ...factObj,
  numberOfRuns: 'number',
  validity: 'string',
  numberOfRepetitions: 'number',
};
const serviceChannelContextObj = {
  ...factObj,
  servicesAndChannels: 'array',
};
const spatialContextObj = {
  ...factObj,
  countries: 'array',
};
const temporalContextObj = {
  ...factObj,
  afterDate: 'string',
  beforeDate: 'string',
};
const userTimeAccessObj = {
  ...factObj,
  restriction: 'string',
  validity: 'string',
};

const generateFact = (classData, payload) => {
  const obj = { class: classData[0] };
  let modelObj = factObj;
  let factType = 'Simple';

  if (classData.length > 1) {
    obj.class = classData[1];
    factType = classData[1];
    switch (classData[1]) {
      case 'FactComposition':
        modelObj = factCompositionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'compositionType', classData[2]);
        }
        break;
      case 'ActionEventFact':
        modelObj = actionEventFactObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'status', classData[2]);
        }
        break;
      case 'TogetherWith':
        modelObj = togetherWithObj;
        break;
      case 'AccessPolicy':
        modelObj = onlyRestrictionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      case 'DeliverModality':
        modelObj = onlyRestrictionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      case 'Device':
        modelObj = onlyRestrictionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      case 'IPEntityContext':
        modelObj = ipentityContextObj;
        break;
      case 'Language':
        modelObj = languageObj;
        break;
      case 'Length':
        modelObj = lengthObj;
        break;
      case 'MaterialFormat':
        modelObj = materialFormatObj;
        break;
      case 'Means':
        modelObj = onlyRestrictionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      case 'Runs':
        modelObj = runsObj;
        break;
      case 'ServiceAccessPolicy':
        modelObj = onlyRestrictionObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      case 'ServiceChannelContext':
        modelObj = serviceChannelContextObj;
        break;
      case 'TemporalContext':
        modelObj = temporalContextObj;
        break;
      case 'UserTimeAccess':
        modelObj = userTimeAccessObj;
        if (classData.length > 2) {
          obj.class = classData[2];
          addElement(modelObj, obj, 'restriction', classData[2]);
        }
        break;
      default:
        break;
    }
  }
  addElement(modelObj, obj, 'type', factType);

  Object.keys(payload).forEach((k) => {
    if (lut[k.toLowerCase()] !== undefined)
      addElement(modelObj, obj, lut[k.toLowerCase()], payload[k], k);
    else if (k !== '@type') console.log('Warning! Left out:' + payload[k]); //addElement(modelObj, obj, 'extra', payload[k], k);
  });

  return obj;
};

module.exports = { generateFact };
