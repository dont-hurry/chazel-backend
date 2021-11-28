const express = require("express");
let series = require("../data/series");
const { generateId } = require("../utils");

const router = express.Router();

router.get("/api/series", (req, res) => {
  res.json(series);
});

router.post("/api/series", (req, res) => {
  const id = generateId();
  const { title, showChapterButtons } = req.body;

  const newSeries = { id, title, anchor: id, showChapterButtons, chapters: [] };
  series.push(newSeries);

  res.json(newSeries);
});

router.put("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  const { title, showChapterButtons } = req.body;
  series = series.map((s) =>
    s.id !== seriesId ? s : { ...s, title, showChapterButtons }
  );
  res.sendStatus(200);
});

router.delete("/api/series/:seriesId", (req, res) => {
  const { seriesId } = req.params;
  series = series.filter((s) => s.id !== seriesId);
  res.sendStatus(200);
});

module.exports = router;
