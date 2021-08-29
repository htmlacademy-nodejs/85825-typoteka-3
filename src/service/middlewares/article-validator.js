'use strict';

const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const articleKeys = [`category`, `announce`, `fullText`, `title`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    logger.error(`Bad request`);
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
