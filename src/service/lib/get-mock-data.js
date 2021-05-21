'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const {
  FILE_NAME
} = require(`../cli/constants`);
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(`Read file ${FILE_NAME}`);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
