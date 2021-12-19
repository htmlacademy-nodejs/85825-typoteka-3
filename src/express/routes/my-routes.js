'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const auth = require(`../middlewares/auth`);

const api = getAPI();
const myRouter = new Router();

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

myRouter.post(`/:id`, auth, async (req, res, next) => {
  const {id} = req.params;
  try {
    await api.removeArticle(id);
  } catch (e) {
    next(e);
  }
  res.redirect(`/my`);
});

myRouter.post(`/comments/:id`, auth, async (req, res, next) => {
  const {id} = req.params;
  try {
    await api.removeComments(id);
  } catch (e) {
    next(e);
  }
  res.redirect(`/my/comments`);
});

module.exports = myRouter;
