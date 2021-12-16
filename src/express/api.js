'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = `http://localhost`;

const port = process.env.API_PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const defaultURL = `${host}:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticlesByCategory({id, limit, offset}) {
    return this._load(`/articles/category/${id}`, {params: {limit, offset}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  addCategory(data) {
    return this._load(`/categories/`, {
      method: `POST`,
      data: {data}
    });
  }

  editCategory(data, id) {
    return this._load(`/categories/${id}`, {
      method: `PUT`,
      data: {data}
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: `DELETE`
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
  updateArticle(data, id) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }
  createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data: {email, password}
    });
  }

  getPopularArticles() {
    return this._load(`/articles/popular`);
  }

  getLastComments() {
    return this._load(`/articles/comments/last`);
  }

  removeArticle(id) {
    return this._load(`/articles/${id}`, {
      method: `DELETE`,
    });
  }

  removeComments(id) {
    return this._load(`/articles/comments/${id}`, {
      method: `DELETE`,
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
