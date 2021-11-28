const express = require("express");
let chapters = require("../data/chapters");
const { generateId } = require("../utils");

const router = express.Router();

router.get("/api/chapters", (req, res) => {
  res.json(chapters);
});

router.post("/api/chapters", (req, res) => {
  let { newChapter, seriesId } = req.body;
  let chapterId = generateId();

  newChapter = { ...newChapter, id: chapterId, articles: [] };
  let targetSeries = series.find((s) => s.id === seriesId);
  targetSeries.chapters.push(chapterId);
  chapters.push(newChapter);

  res.json(newChapter);
});

router.put("/api/chapters/:chapterId", (req, res) => {
  const { chapterId } = req.params;
  const { title } = req.body;
  chapters = chapters.map((c) => (c.id !== chapterId ? c : { ...c, title }));
  res.sendStatus(200);
});

// For deletion
router.post("/api/chapters/:chapterId", (req, res) => {
  let { seriesId } = req.body;
  let { chapterId } = req.params;

  let targetSeries = series.find((s) => s.id === seriesId);
  targetSeries.chapters = targetSeries.chapters.filter(
    (cid) => cid !== chapterId
  );

  chapters = chapters.filter((c) => c.id !== chapterId);

  res.sendStatus(200);
});

module.exports = router;
