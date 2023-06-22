const mcoDeonticExpressionObj = {
  identifier: 'string',
  type: 'string',
  issuedIn: 'string',
  metadata: 'map',
  textClauses: 'array',
  act: 'string',
  actedBySubject: 'string',
  actObjects: 'array',
  resultantObject: 'array',
  constraints: 'array',
  issuer: 'string',
  extra: 'map',
};
const mcoPermissionObj = {
  ...mcoDeonticExpressionObj,
  percentage: 'number',
  incomePercentage: 'number',
  isExclusive: 'boolean',
  hasSublicenseRight: 'boolean',
};

module.exports = { mcoDeonticExpressionObj, mcoPermissionObj };
