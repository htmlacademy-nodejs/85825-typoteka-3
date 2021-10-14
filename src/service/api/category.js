'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const RouteParamsValidator = require(`../middlewares/route-params-validator`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:categoryId`, RouteParamsValidator, async (req, res) => {
    const {categoryId} = req.params;
    const category = await service.findOne(categoryId);

    if (!category) {
      logger.error(`Not found with ${categoryId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK)
      .json(category);
  });
};
