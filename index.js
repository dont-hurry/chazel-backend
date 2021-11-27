const express = require("express");
const cors = require("cors");
const { getCurrentTimeString, generateId } = require("./utils");
let series = require("./data/series");
let chapters = require("./data/chapters");
let articles = require("./data/articles");
const fs = require("fs");

const BASE_ARTICLE_PATH = "data/articles";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  let logElements = [
    getCurrentTimeString(),
    req.method,
    req.path,
    JSON.stringify(req.body),
  ];
  console.log(logElements.join(" "));
  next();
};

app.use(requestLogger);

app.get("/api/series", (req, res) => {
  res.json(series);
});

app.get("/api/chapters", (req, res) => {
  res.json(chapters);
});

app.get("/api/articles/:articleId", (req, res) => {
  const { articleId } = req.params;
  res.json(getArticleById(articleId));
});

app.get("/api/sibling-articles/:targetArticleId", (req, res) => {
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

app.post("/api/series", (req, res) => {
  const id = generateId();
  const { title, showChapterButtons } = req.body;

  const newSeries = { id, title, anchor: id, showChapterButtons, chapters: [] };
  series.push(newSeries);

  res.json(newSeries);
});

app.delete("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  series = series.filter((s) => s.id !== seriesId);
  res.sendStatus(200);
});

app.put("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  const { title, showChapterButtons } = req.body;
  series = series.map((s) =>
    s.id !== seriesId ? s : { ...s, title, showChapterButtons }
  );
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

function getArticleById(articleId) {
  const { path } = articles.find((article) => article.id === articleId);
  let rawData = fs.readFileSync(`${BASE_ARTICLE_PATH}/${path}`);
  return { ...JSON.parse(rawData), articleId };
}
