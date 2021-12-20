'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {prepareErrors} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const csrf = require(`csurf`);

const csrfProtection = csrf();
const articlesRouter = new Router();
const api = getAPI();

const OFFERS_PER_PAGE = 8;

articlesRouter.get(`/category/:id`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  const {id} = req.params;
  page = +page;
  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [category, categories, {count, articles}] = await Promise.all([
    api.getCategory(id),
    api.getCategories(true),
    api.getArticlesByCategory({id, limit, offset})
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`articles-by-category`, {category, categories, user, page, totalPages, articles});
});
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories();
    res.render(`new-post`, {user, categories, csrfToken: req.csrfToken()});
  } catch (e) {
    next(e);
  }
});
articlesRouter.post(`/add`, upload.single(`upload`), auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {body, file} = req;
  try {
    const offerData = {
      ...body,
      image: file ? file.filename : ``,
      categories: body.category,
      userId: user.id
    };
    delete offerData.category;
    await api.createArticle(offerData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    try {
      const categories = await api.getCategories();
      res.render(`new-post`, {user, categories, validationMessages});
    } catch (err) {
      next(err);
    }
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;
  let article;
  let categories;
  try {
    const offerData = {
      ...body,
      image: file ? file.filename : ``,
      categories: body.category,
      userId: user.id
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
      res.render(`edit-post`, {user, article, categories, validationMessages});
    } catch (err) {
      next(err);
    }
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
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
  res.render(`edit-post`, {user, article, categories, csrfToken: req.csrfToken()});
});
articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article, user, csrfToken: req.csrfToken()});
}
);

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {text: message, userId: user.id});
    res.redirect(`back`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id, true);
    res.render(`post`, {article, validationMessages, user});
  }
});

module.exports = articlesRouter;
