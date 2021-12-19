'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const RouteParamsValidator = require(`../middlewares/route-params-validator`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const route = new Router();

module.exports = (app, articleService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/popular`, async (req, res) => {
    const popularArticles = await articleService.popularArticles();
    if (!popularArticles) {
      logger.error(`Not found popular articles`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found popular articles`);
    }

    return res.status(HttpCode.OK)
      .json(popularArticles);
  });

  route.get(`/category/:id`, async (req, res) => {
    const {id} = req.params;
    const {limit, offset} = req.query;

    const {count, articles} = await articleService.findArticlesByCategory(id, limit, offset);

    res.status(HttpCode.OK)
      .json({
        count,
        articles
      });
  });

  route.get(`/:articleId`, RouteParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [RouteParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const existsArticle = await articleService.findOne(articleId);

    if (!existsArticle) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, RouteParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      logger.error(`Not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });
};
