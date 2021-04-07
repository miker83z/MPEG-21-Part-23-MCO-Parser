const { getContractFromMCO } = require('..');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [{ name: 'contract', alias: 'c', type: String }];
const options = commandLineArgs(optionDefinitions);

const contractPath = options.contract;

const ttl = fs.readFileSync(contractPath, 'utf-8');
console.log(getContractFromMCO(ttl));
