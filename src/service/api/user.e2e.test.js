'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
const {HttpCode} = require(`../constants`);
const passwordUtils = require(`../lib/password`);

const mockData = [
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "user": `ivanov@example.com`,
    "categories": [
      `Программирование`,
      `Музыка`,
      `IT`,
      `За жизнь`,
      `Деревья`,
      `Кино`,
      `Без рамки`,
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": ` Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-)`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Хочу такую же футболку :-) Это где ж такие красоты?`,
      },
    ],
  },
  {
    "title": `Как начать программировать`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь.`,
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Железо`,
      `Разное`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
    ],
  },
  {
    "title": `Ёлки. История деревьев`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "user": `ivanov@example.com`,
    "categories": [
      `Музыка`,
      `Без рамки`,
      `Железо`,
      `За жизнь`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "user": `ivanov@example.com`,
    "categories": [
      `IT`,
      `Разное`,
      `Программирование`,
      `Без рамки`,
      `За жизнь`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? `,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Согласен с автором! Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "user": `petrov@example.com`,
    "categories": [
      `Программирование`,
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему?`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
];
const mockCategories = [
  `Железо`,
  `Деревья`,
  `Кино`,
  `За жизнь`,
  `Разное`,
  `Без рамки`,
  `IT`,
  `Музыка`,
  `Программирование`,
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const users = [
    {
      name: `Иван`,
      surname: `Иванов`,
      email: `ivanov@example.com`,
      passwordHash: await passwordUtils.hash(`ivanov`),
      avatar: `avatar01.jpg`
    },
    {
      name: `Петр`,
      surname: `Петров`,
      email: `petrov@example.com`,
      passwordHash: await passwordUtils.hash(`ivanov`),
      avatar: `avatar02.jpg`
    }
  ];
  await initDB(mockDB, {categories: mockCategories, offers: mockData, users});
  const app = express();
  app.use(express.json());
  user(app, new DataService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    name: `Сидор`,
    surname: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    name: `Сидор`,
    surname: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`User name is Иван`, () => expect(response.body.name).toBe(`Иван`));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov2`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});
