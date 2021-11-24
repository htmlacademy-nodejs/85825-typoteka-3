'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {prepareErrors} = require(`../../utils`);
const {getAPI} = require(`../api`);
const upload = require(`../upload`);
const api = getAPI();
const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
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

  res.render(`main`, {articles, page, totalPages, categories});
});
mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
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
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = mainRouter;
