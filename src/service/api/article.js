'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const route = new Router();

module.exports = (app, articleService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existsArticle = articleService.findOne(articleId);

    if (!existsArticle) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (!article) {
      logger.error(`Not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });
};
