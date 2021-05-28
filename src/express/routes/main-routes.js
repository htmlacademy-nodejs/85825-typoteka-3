'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

mainRouter.get(`/`, async (req, res, next) => {
  let articles = [];
  try {
    articles = await api.getArticles();
  } catch (e) {
    next(e);
  }
  res.render(`main`, {articles});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res, next) => {
  let result = [];
  if (req.query.search) {
    try {
      result = await api.search(req.query.search);
    } catch (e) {
      if (e.response.status !== 404) {
        next(e);
      }
    }
  }
  res.render(`search`, {
    colorWrap: true,
    searchQuery: req.query.search,
    result
  });
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
