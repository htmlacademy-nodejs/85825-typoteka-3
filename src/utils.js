'use strict';
const path = require('path');
const util = require('util');
const fs = require('fs');
const { TEXT_FILE_PATH } = require('./service/cli/constants');

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getTextArr = async (filename) => {
	const readFile = util.promisify(fs.readFile)
	const dataText = await readFile(path.join(__dirname, '..', TEXT_FILE_PATH, filename), 'utf8');
	return dataText ? dataText.split("\n") : [];
};