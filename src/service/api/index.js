'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const comment = require(`../api/comment`);
const {ExitCode} = require(`../constants`);

const getMockData = require(`../lib/get-mock-data`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  let mockData;
  try {
    mockData = await getMockData();
  } catch (e) {
    logger.error(`Can't write data to file...`);
    process.exit(ExitCode.uncaughtFatalException);
  }

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData));
  comment(app, new ArticleService(mockData), new CommentService());
})();

module.exports = app;

