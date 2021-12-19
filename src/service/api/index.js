'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const initApi = require(`./init`);

const app = new Router();

defineModels(sequelize);

initApi(app, sequelize);

module.exports = app;

