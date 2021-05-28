'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`new-post`, {user: true, categories});
  } catch (e) {
    next(e);
  }
});
articlesRouter.post(`/add`, async (req, res) => {
  try {
    await api.createArticle(req.body);
    res.redirect(`/my`);
  } catch (e) {
    console.log(e);
    res.redirect(`back`);
  }
});
articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;
  let article;
  let categories;
  try {
    [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);
  } catch (e) {
    next(e);
  }
  res.render(`edit-post`, {user: true, article, categories});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post`, {user: true}));

module.exports = articlesRouter;
