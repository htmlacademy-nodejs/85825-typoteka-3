'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const {prepareErrors} = require(`../../utils`);
const api = getAPI();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const category = await api.getCategory(id);
  const categories = await api.getCategories(true);
  res.render(`articles-by-category`, {category, categories});
});
articlesRouter.get(`/add`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`new-post`, {user: true, categories});
  } catch (e) {
    next(e);
  }
});
articlesRouter.post(`/add`, async (req, res, next) => {
  const {body} = req;
  try {
    const offerData = {
      ...body,
      categories: body.category
    };
    delete offerData.category;
    await api.createArticle(offerData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    try {
      const categories = await api.getCategories();
      res.render(`new-post`, {user: true, categories, validationMessages});
    } catch (err) {
      next(err);
    }
  }
});

articlesRouter.post(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;
  const {body} = req;
  let article;
  let categories;
  try {
    const offerData = {
      ...body,
      categories: body.category
    };
    delete offerData.category;
    await api.updateArticle(offerData, id);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    try {
      [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories()
      ]);
      res.render(`edit-post`, {user: true, article, categories, validationMessages});
    } catch (e) {
      next(e);
    }
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
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article});
}
);

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`back`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id, true);
    res.render(`post`, {article, validationMessages});
  }
});

module.exports = articlesRouter;
