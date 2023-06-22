const ipentityObj = {
  identifier: 'string',
  type: 'string',
  metadata: 'map',
  socialTag: 'string',
  isDigital: 'boolean',
  rightsOwners: 'array',
  isMadeUpOf: 'array',
  resultedFrom: 'array',
  isAudio: 'boolean',
  segments: 'array',
  tracks: 'array',
  interval: 'array',
  extra: 'map',
};
const segmentObj = {
  ...ipentityObj,
  segmentOf: 'string',
  contains: 'array',
  onTrack: 'array',
};

module.exports = { ipentityObj, segmentObj };
