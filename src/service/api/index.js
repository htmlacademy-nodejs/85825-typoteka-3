'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);

const CategoryService = require(`../data-service/category`);
const SearchService = require(`../data-service/search`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const UserService = require(`../data-service/user`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);
// const initdb = async () => {
//   try {
//     await sequelize.sync({force: true});
//     console.info(`Структура БД успешно создана.`);
//   } catch (err) {
//     console.error(`Не удалось создать таблицы в БД ${err}`);
//   }
//
//   await sequelize.close();
// };
//
// initdb();

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;

