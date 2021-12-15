'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const RouteParamsValidator = require(`../middlewares/route-params-validator`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article);
    res.status(HttpCode.OK)
      .json(comments);

  });

  route.get(`/comments/last`, async (req, res) => {
    const comments = await commentService.lastComment();
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/comments/:commentId`, RouteParamsValidator, async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      logger.error(`Not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
