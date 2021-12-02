'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();
const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res, next) => {
  const {user} = req.session;
  let articles = [];
  try {
    articles = await api.getArticles({});
  } catch (e) {
    next(e);
  }
  res.render(`my`, {articles, user});
});
myRouter.get(`/comments`, auth, async (req, res, next) => {
  const {user} = req.session;
  let articles = [];
  try {
    articles = await api.getArticles({comments: true});
  } catch (e) {
    next(e);
  }
  res.render(`comments`, {articles, user});
});

module.exports = myRouter;
