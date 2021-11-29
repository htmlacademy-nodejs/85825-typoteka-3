"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers, users}) => {
  const {Category, Article, User} = await defineModels(sequelize);
  await sequelize.sync({force: true});
  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );
  let userModels;
  try {
    userModels = await User.bulkCreate(users, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});
  } catch (e) {
    console.log(e);
  }
  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  offers.forEach((offer) => {
    offer.userId = userIdByEmail[offer.user];
    offer.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Article.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(
        offer.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });
  await Promise.all(offerPromises);
};
