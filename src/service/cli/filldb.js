'use strict';

const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

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
  MAX_COMMENTS,
} = require(`./constants`);
const {ExitCode} = require(`../constants`);

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

const users = async () => [
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: await passwordUtils.hash(`ivanov`),
    avatar: `avatar01.png`
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: await passwordUtils.hash(`petrov`),
    avatar: `avatar02.png`
  }
];

const generateComments = (count, comments, user) => {
  return Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    user
  }));
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateOffers = async (count, categoriesModel) => {
  const titles = await getTextArr(`titles.txt`);
  const sentences = await getTextArr(`sentences.txt`);
  const commentsArr = await getTextArr(`comments.txt`);
  const usersData = await users();
  return Array(count).fill({}).map(() => {
    const title = titles[getRandomInt(0, titles.length - 1)];
    const announce = shuffle(sentences).slice(1, ANNOUNCE_LENGTH).join(` `);
    const fullText = shuffle(sentences).slice(1, getRandomInt(1, 4)).join(` `);
    const categories = getRandomSubarray(categoriesModel);
    const user = usersData[getRandomInt(0, users.length - 1)].email;
    const comments = generateComments(getRandomInt(1, MAX_COMMENTS), commentsArr, usersData[getRandomInt(0, users.length - 1)].email);

    const today = new Date();
    const startDate = new Date(new Date().setMonth(today.getMonth() - MONTH_RESTRICT));
    const createdDate = formatDate(getRandomDate(startDate, today));

    return ({title, createdDate, announce, fullText, categories, comments, user});
  });
};


module.exports = {
  name: `--filldb`,
  run: async (args) => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);
    const categories = await getTextArr(`categories.txt`);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer < 0) {
      logger.error(chalk.blue(`Указано отрицательное число`));
      process.exit(ExitCode.UncaughtFatalException);
    }

    if (countOffer > MAX_COUNT) {
      logger.error(chalk.blue(`Не больше 1000 объявлений`));
      process.exit(ExitCode.UncaughtFatalException);
    }
    const offers = await generateOffers(countOffer, categories);
    const usersData = await users();
    return initDatabase(sequelize, {offers, categories, users: usersData});
  },
};
