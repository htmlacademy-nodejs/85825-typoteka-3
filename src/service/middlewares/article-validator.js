'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const ErrorOfferMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANON_MIN: `Анонс содержит меньше 30 символов`,
  ANON_MAX: `Анонс не может содержать более 250 символов`,
  ANON_NULL: `Анонс не может быть пустой`,
  DESCRIPTION_MAX: `Полный текст не может содержать более 1000 символов`,
  REQUIRED_CATEGORIES: `Не выбраны категории`,
  REQUIRED_DESCRIPTION: `Не заполнен полный текст`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES,
      })
  ).min(1).required().messages({
    'any.required': ErrorOfferMessage.REQUIRED_CATEGORIES
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX
  }),
  fullText: Joi.string().max(1000).allow(``).messages({
    'string.max': ErrorOfferMessage.DESCRIPTION_MAX,
  }),
  photo: Joi.string().allow(``),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.ANON_MIN,
    'string.max': ErrorOfferMessage.ANON_MAX,
    'string.empty': ErrorOfferMessage.ANON_NULL,
  }),
  upload: Joi.string().allow(``),
  createdDate: Joi.string().allow(``),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    logger.error(`Bad request`);
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
