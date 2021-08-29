'use strict';
const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const offers = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],
    });
    return offers.map((offer) => offer.get());
  }

}

module.exports = SearchService;
