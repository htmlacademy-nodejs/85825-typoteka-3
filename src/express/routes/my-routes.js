'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

myRouter.get(`/`, async (req, res, next) => {
  let articles = [];
  try {
    articles = await api.getArticles();
  } catch (e) {
    next(e);
  }
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res, next) => {
  let articles = [];
  try {
    articles = await api.getArticles({comments: true});
  } catch (e) {
    next(e);
  }
  res.render(`comments`, {articles});
});

module.exports = myRouter;
