'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    return this._Article.findByPk(id, {include});
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, {model: this._Comment, as: Aliase.COMMENTS, include: [Aliase.USERS]}],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({model: this._Comment, as: Aliase.COMMENTS, include: [Aliase.USERS]});
    }
    const article = await this._Article.findAll({include});
    return article.map((item) => item.get());
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

}

module.exports = ArticleService;
