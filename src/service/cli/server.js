'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const routes = require(`../api`);

const {
  FILE_NAME,
  DEFAULT_PORT
} = require('./constants');
const {HttpCode, API_PREFIX} = require('../constants');


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = express();
    app.use(express.json());
    app.use(API_PREFIX, routes);
    // app.get(`/posts`, async (req, res) => {
    //   try {
    //     const fileContent = await fs.readFile(FILE_NAME);
    //     const mocks = JSON.parse(fileContent);
    //     res.json(mocks);
    //   } catch (err) {
    //     res.json([]);
    //   }
    // });

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));
    app.listen(port);
  }
};
