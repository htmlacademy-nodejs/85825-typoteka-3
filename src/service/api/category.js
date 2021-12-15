'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const RouteParamsValidator = require(`../middlewares/route-params-validator`);
const categoryValidator = require(`../middlewares/category-validator`);
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

  route.post(`/`, categoryValidator, async (req, res) => {
    const categoryName = req.body.data;
    const result = await service.create(categoryName);

    res.status(HttpCode.OK).json(result);
  });

  route.put(`/:categoryId`, categoryValidator, async (req, res) => {
    const {categoryId} = req.params;
    const categoryName = req.body.data;
    const category = await service.findOne(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const updated = await service.update(categoryId, categoryName);

    return res.status(HttpCode.OK).json(updated);
  });

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const category = await service.findOne(categoryId, true);

    if (category.count > 1) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Не пустую категорию невозможно удалить`);
    }

    const deleted = await service.drop(categoryId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });
};
