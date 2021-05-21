'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const {
  getRandomInt,
  shuffle,
  getTextArr,
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  ANNOUNCE_LENGTH,
  MONTH_RESTRICT,
  FILE_NAME,
  MAX_COMMENTS,
} = require(`./constants`);
const {ExitCode, MAX_ID_LENGTH} = require(`../constants`);

const FILE_NAME_OUTPUT = path.join(__dirname, `../../../` + FILE_NAME);

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const addZero = (int) => {
  return int < 10 ? `0` + int : int;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = async (count) => {
  const titles = await getTextArr(`titles.txt`);
  const sentences = await getTextArr(`sentences.txt`);
  const categories = await getTextArr(`categories.txt`);
  const commentsArr = await getTextArr(`comments.txt`);
  return Array(count).fill({}).map(() => {
    const id = nanoid(MAX_ID_LENGTH);
    const title = titles[getRandomInt(0, titles.length - 1)];
    const announce = shuffle(sentences).slice(1, ANNOUNCE_LENGTH).join(` `);
    const fullText = shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `);
    const category = shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));
    const comments = generateComments(getRandomInt(1, MAX_COMMENTS), commentsArr);

    const today = new Date();
    const startDate = new Date(new Date().setMonth(today.getMonth() - MONTH_RESTRICT));
    const createdDate = formatDate(getRandomDate(startDate, today));

    return ({id, title, createdDate, announce, fullText, category, comments});
  });
};

const writeFile = async (content) => {
  try {
    await fs.writeFile(FILE_NAME_OUTPUT, content, `utf8`);
    logger.info(chalk.blue(`Operation success. File created.`));
    process.exit(ExitCode.success);
  } catch (e) {
    logger.error(chalk.blue(`Can't write data to file...`));
    process.exit(ExitCode.uncaughtFatalException);
  }
};

module.exports = {
  name: `--generate`,
  run: async (args) => {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer < 0) {
      logger.error(chalk.blue(`Указано отрицательное число`));
      process.exit(ExitCode.uncaughtFatalException);
    }

    if (countOffer > MAX_COUNT) {
      logger.error(chalk.blue(`Не больше 1000 объявлений`));
      process.exit(ExitCode.uncaughtFatalException);
    }
    const offers = await generateOffers(countOffer);
    const content = JSON.stringify(offers, null, 4);

    writeFile(content);

  },
};
