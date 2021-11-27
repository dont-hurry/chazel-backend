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

app.put("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  const { title, showChapterButtons } = req.body;
  series = series.map((s) =>
    s.id !== seriesId ? s : { ...s, title, showChapterButtons }
  );
  res.sendStatus(200);
});

app.delete("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  series = series.filter((s) => s.id !== seriesId);
  res.sendStatus(200);
});

app.post("/api/chapters", (req, res) => {
  let { newChapter, seriesId } = req.body;
  let chapterId = generateId();

  newChapter = { ...newChapter, id: chapterId, articles: [] };
  let targetSeries = series.find((s) => s.id === seriesId);
  targetSeries.chapters.push(chapterId);
  chapters.push(newChapter);

  res.json(newChapter);
});

app.put("/api/chapters/:chapterId", (req, res) => {
  const { chapterId } = req.params;
  const { title } = req.body;
  chapters = chapters.map((c) => (c.id !== chapterId ? c : { ...c, title }));
  res.sendStatus(200);
});

// For deletion
app.post("/api/chapters/:chapterId", (req, res) => {
  let { seriesId } = req.body;
  let { chapterId } = req.params;

  let targetSeries = series.find((s) => s.id === seriesId);
  targetSeries.chapters = targetSeries.chapters.filter(
    (cid) => cid !== chapterId
  );

  chapters = chapters.filter((c) => c.id !== chapterId);

  res.sendStatus(200);
});

app.post("/api/articles", (req, res) => {
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

app.put("/api/articles/:articleId", (req, res) => {
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
app.post("/api/articles/:articleId", (req, res) => {
  let { chapterId } = req.body;
  let { articleId } = req.params;

  let targetChapter = chapters.find((c) => c.id === chapterId);
  targetChapter.articles = targetChapter.articles.filter(
    (aid) => aid !== articleId
  );

  articles = articles.filter((a) => a.id !== articleId);

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
