'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);
const comment = require(`./comment`);

const CategoryService = require(`../data-service/category`);
const SearchService = require(`../data-service/search`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const UserService = require(`../data-service/user`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize));
  comment(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;

