const actionObj = {
  identifier: 'string',
  type: 'string',
  impliesAlso: 'array',
  resultsIn: 'array',
  rightGivenBy: 'array',
  actedBy: 'string',
  actedOver: 'array',
};
const tradeObj = {
  ...actionObj,
  sellsDeontic: 'string',
};
const provideObj = {
  ...actionObj,
  isOnLoan: 'boolean',
  recipients: 'array',
};
const paymentObj = {
  ...actionObj,
  beneficiaries: 'array',
  incomeSources: 'array',
  amount: 'number',
  currency: 'string',
  incomePercentage: 'number',
};
const notifyObj = {
  ...actionObj,
  recipients: 'array',
  isAbout: 'array',
};

module.exports = {
  actionObj,
  tradeObj,
  provideObj,
  paymentObj,
  notifyObj,
};
