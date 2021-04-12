'use strict';

const express = require(`express`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => {
  res.status(404).render(`errors/400`);
});

app.use((err, req, res) => {
  console.log('==err==', err);
  res.status(500).render(`errors/500`);
});

app.listen(DEFAULT_PORT);
