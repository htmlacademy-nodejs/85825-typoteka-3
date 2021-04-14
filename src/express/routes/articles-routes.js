'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`new-post`, {user: true}));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`new-post`, {user: true}));
articlesRouter.get(`/:id`, (req, res) => res.render(`post`, {user: true}));

module.exports = articlesRouter;
