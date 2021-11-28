const express = require("express");
let chapters = require("../data/chapters");
let articles = require("../data/articles");
const fs = require("fs");
const BASE_ARTICLE_PATH = "data/articles";
const { generateId } = require("../utils");

const router = express.Router();

router.get("/api/articles/:articleId", (req, res) => {
  const { articleId } = req.params;
  res.json(getArticleById(articleId));
});

router.get("/api/sibling-articles/:targetArticleId", (req, res) => {
  const { targetArticleId } = req.params;
  let previousArticle = null;
  let nextArticle = null;

  for (let { articles } of chapters) {
    let index = articles.indexOf(targetArticleId);

    if (~index) {
      if (index - 1 >= 0) {
        previousArticle = getArticleById(articles[index - 1]);
      }
      if (index + 1 < articles.length) {
        nextArticle = getArticleById(articles[index + 1]);
      }
      break;
    }
  }

  res.json({ previousArticle, nextArticle });
});

router.post("/api/articles", (req, res) => {
  let {
    newArticle: { title, date, content },
    chapterId,
  } = req.body;
  let articleId = generateId();

  const path = `temp/${articleId}.json`;
  fs.writeFileSync(
    `${BASE_ARTICLE_PATH}/${path}`,
    JSON.stringify({ coverImage: "default-cover.jpg", date, title, content })
  );

  let targetChapter = chapters.find((c) => c.id === chapterId);
  targetChapter.articles.push(articleId);
  articles.push({ id: articleId, path });

  res.json({ articleId });
});

router.put("/api/articles/:articleId", (req, res) => {
  const { articleId } = req.params;
  const { title, date, content } = req.body;

  const { path } = articles.find((a) => a.id === articleId);
  const rawData = fs.readFileSync(`${BASE_ARTICLE_PATH}/${path}`);
  const articleObj = JSON.parse(rawData);

  fs.writeFileSync(
    `${BASE_ARTICLE_PATH}/${path}`,
    JSON.stringify({ ...articleObj, title, date, content })
  );

  res.sendStatus(200);
});

// For deletion
router.post("/api/articles/:articleId", (req, res) => {
  let { chapterId } = req.body;
  let { articleId } = req.params;

  let targetChapter = chapters.find((c) => c.id === chapterId);
  targetChapter.articles = targetChapter.articles.filter(
    (aid) => aid !== articleId
  );

  articles = articles.filter((a) => a.id !== articleId);

  res.sendStatus(200);
});

function getArticleById(articleId) {
  const { path } = articles.find((article) => article.id === articleId);
  let rawData = fs.readFileSync(`${BASE_ARTICLE_PATH}/${path}`);
  return { ...JSON.parse(rawData), articleId };
}

module.exports = router;
