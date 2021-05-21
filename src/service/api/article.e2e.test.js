'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    "id": `UmqfWT`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `2021-04-30 17:29:50`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "category": [
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
        "id": `dy4Isr`,
        "text": ` Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "id": `hjFjjH`,
        "text": `Хочу такую же футболку :-)`,
      },
      {
        "id": `Q9Yj12`,
        "text": `Согласен с автором! Хочу такую же футболку :-) Это где ж такие красоты?`,
      },
    ],
  },
  {
    "id": `P1h75L`,
    "title": `Как начать программировать`,
    "createdDate": `2021-02-28 00:37:05`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь.`,
    "category": [
      `Кино`,
      `Железо`,
      `Разное`,
    ],
    "comments": [
      {
        "id": `ofThKs`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `lqcVVE`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "id": `jcmcoU`,
        "text": `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
      },
      {
        "id": `Omhz-q`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
    ],
  },
  {
    "id": `mKBxcr`,
    "title": `Ёлки. История деревьев`,
    "createdDate": `2021-05-13 10:58:15`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "category": [
      `Музыка`,
      `Без рамки`,
      `Железо`,
      `За жизнь`,
    ],
    "comments": [
      {
        "id": `JIDjYG`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        "id": `zXgGFV`,
        "text": `Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    "id": `3Bx_Qz`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `2021-05-08 21:32:46`,
    "announce": `Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "category": [
      `IT`,
      `Разное`,
      `Программирование`,
      `Без рамки`,
      `За жизнь`,
    ],
    "comments": [
      {
        "id": `HRjswt`,
        "text": `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "id": `5OboZx`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? `,
      },
      {
        "id": `TPIWPk`,
        "text": `Плюсую, но слишком много буквы!`,
      },
      {
        "id": `BVyyq1`,
        "text": `Мне кажется или я уже читал это где-то? Согласен с автором! Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    "id": `-5bIbZ`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `2021-03-17 00:41:53`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "category": [
      `Программирование`,
    ],
    "comments": [
      {
        "id": `mverld`,
        "text": `Планируете записать видосик на эту тему?`,
      },
      {
        "id": `BtbcKI`,
        "text": `Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const cloneData = JSON.parse(JSON.stringify(mockData));
  article(app, new ArticleService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals "bDzXPm"`, () => expect(response.body[0].id).toBe(`UmqfWT`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app).get(`/articles/UmqfWT`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как собрать камни бесконечности"`, () => {
    expect(response.body.title).toBe(`Как собрать камни бесконечности`);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Железо`,
    fullText: `Полный текст`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Articles count is changed`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Железо`,
    fullText: `Полный текст`
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Железо`,
    fullText: `Полный текст`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).put(`/articles/UmqfWT`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Article is really changed`, async () => {
    await request(app).get(`/articles/UmqfWT`)
      .expect((res) => expect(res.body.title).toBe(`Валидный заголовок`));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Железо`,
    fullText: `Полный текст`
  };

  const app = createAPI();

  await request(app).put(`/articles/noexists`).send(newArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    category: `Железо`,
    fullText: `Полный текст`
  };

  const app = createAPI();

  await request(app).put(`/articles/UmqfWT`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).delete(`/articles/UmqfWT`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`UmqfWT`));
  test(`Articles count is 5 now`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(5));
  });
});

test(`API returns to delete non-existent article`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/noexists`).expect(HttpCode.NOT_FOUND);
});

