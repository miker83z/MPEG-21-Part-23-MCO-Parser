# MCO Parser for Smart Contracts for Media

This software parses MCO contracts represented in TURTLE and converts them in Media Contractual Objects. This software is composed of a series of JSON file composing the Look Up Table (`./lookup-tables`), a set of generators for the generation of Media Contractual Objects (`./generators`) and a set of handlers to manage the inter-relation of Objects during the generation phase (`./handlers`). The parsing process starts in the `./index.js` file: a Turtle file representing the MCO contract is transformed into the JSON-LD format and then Elements in it are used to generate the Objects. For more info check the READMEs into the sub-folders.

## Installation

NodeJS is needed to execute the parser, as well as NPM.
To use the parser it is needed to execute the following command in the main directory:

```
npm install
```

## Usage

To use the parser execute one of the following command in the main directory:

```
node test/index.js -c [ turtle file path ]
node test/index.js --contract [ turtle file path ]
```

Importing this module will provide with a method `getContractFromMCO` that takes in input a string in Turtle form and returns the related Media Contractual Objects.

## Test

To test the parser execute the following command in the main directory:

```
node test/index.js -c turtle/new/use-case-stream-small-label.ttl
```
