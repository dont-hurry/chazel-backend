const express = require("express");
const cors = require("cors");
const { getCurrentTimeString } = require("./utils");
const series = require("./data/series");
const fs = require("fs");

const BASE_ARTICLE_PATH = "data/articles";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

const requestLogger = (req, res, next) => {
  let logElements = [getCurrentTimeString(), req.method, req.path];
  console.log(logElements.join(" "));
  next();
};

app.use(requestLogger);

app.get("/api/series", (req, res) => {
  res.json(series);
});

// Get an article (with a specific chapter)
app.get("/api/articles/:series/:chapter/:articleId", (req, res) => {
  let { series, chapter, articleId } = req.params;
  let filepath = `${BASE_ARTICLE_PATH}/${series}/${chapter}/${articleId}.json`;
  let rawData = fs.readFileSync(filepath);
  res.json(JSON.parse(rawData));
});

// Get an article (without a specific chapter)
app.get("/api/articles/:series/:articleId", (req, res) => {
  let { series, articleId } = req.params;
  let filepath = `data/articles/${series}/${articleId}.json`;
  let rawData = fs.readFileSync(filepath);
  res.json(JSON.parse(rawData));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
