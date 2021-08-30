"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
