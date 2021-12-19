'use strict';
const path = require(`path`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {TEXT_FILE_PATH} = require(`./service/cli/constants`);
const {ExitCode} = require(`./service/constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getTextArr = async (filename) => {
  try {
    const dataText = await fs.readFile(path.join(__dirname, `..`, TEXT_FILE_PATH, filename), `utf8`);
    return dataText ? dataText.split(`\n`) : [];
  } catch (e) {
    console.error(chalk.red(`Ошибка чтения файла ${filename}`));
    return process.exit(ExitCode.UncaughtFatalException);
  }
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports = {
  getRandomInt,
  shuffle,
  getTextArr,
  prepareErrors
};
