const express = require("express");
const cors = require("cors");
const { getCurrentTimeString } = require("./utils");
const series = require("./data/series");
const chapters = require("./data/chapters");
const articles = require("./data/articles");
const fs = require("fs");

const BASE_ARTICLE_PATH = "data/articles";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  let logElements = [getCurrentTimeString(), req.method, req.path];
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
  console.log(req.body);
  res.json({ foo: "bar" });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

function getArticleById(articleId) {
  const { path } = articles.find((article) => article.id === articleId);
  let rawData = fs.readFileSync(`${BASE_ARTICLE_PATH}/${path}`);
  return { ...JSON.parse(rawData), articleId };
}
