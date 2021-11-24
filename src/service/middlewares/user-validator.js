'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  SURNAME: `Фамилия содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  REQUIRED_SURNAME: `Поле фамилия не заполнено`,
  REQUIRED_NAME: `Поле имя не заполнено`,
};

const schema = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.NAME,
    'string.empty': ErrorRegisterMessage.REQUIRED_NAME
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.SURNAME,
    'string.empty': ErrorRegisterMessage.REQUIRED_SURNAME
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().allow(``)
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
