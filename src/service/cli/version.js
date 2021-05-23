'use strict';

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(chalk.blue(version));
  }
};
