'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {prepareErrors} = require(`../../utils`);
const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const api = getAPI();
const auth = require(`../middlewares/auth`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories, user});
});
mainRouter.post(`/register`, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`name`],
    surname: body[`surname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});
mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});
mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});
mainRouter.get(`/register`, csrfProtection, (req, res) => res.render(`sign-up`, {csrfToken: req.csrfToken()}));
mainRouter.get(`/login`, csrfProtection, (req, res) => res.render(`login`, {csrfToken: req.csrfToken()}));
mainRouter.get(`/search`, async (req, res, next) => {
  const {user} = req.session;
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
    result,
    user
  });
});
mainRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user});
});

module.exports = mainRouter;
