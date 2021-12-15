'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
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
    return this._Article.findByPk(id, {
      include,
      order: needComments ? [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ] : []});
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
    const orderArr = [
      [`createdAt`, `DESC`]
    ];
    if (needComments) {
      include.push({model: this._Comment, as: Aliase.COMMENTS, include: [Aliase.USERS]});
      orderArr.push([Aliase.COMMENTS, `createdAt`, `DESC`]);
    }
    const article = await this._Article.findAll(
        {
          include,
          order: orderArr,
        });
    return article.map((item) => item.get());
  }

  async findArticlesByCategory(categoryId, limit, offset) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articles: rows};
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async popularArticles() {
    const options = {
      subQuery: false,
      limit: 4,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ],
        exclude: [`title`, `image`, `fullText`, `createdAt`, `updatedAt`, `userId`]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        }
      ],
      group: [
        `Article.id`,
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };
    const popularActicles = await this._Article.findAll(options);
    return popularActicles.map((item) => item.get());
  }
}

module.exports = ArticleService;
