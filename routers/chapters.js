const express = require("express");
let series = require("../data/series");
let chapters = require("../data/chapters");
const { extractTokenFromRequest, generateId } = require("../utils");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../constants");

const router = express.Router();

router.get("/api/chapters", (req, res) => {
  res.json(chapters);
});

router.post("/api/chapters", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    let { newChapter, seriesId } = req.body;
    let chapterId = generateId();

    newChapter = { ...newChapter, id: chapterId, articles: [] };
    let targetSeries = series.find((s) => s.id === seriesId);
    targetSeries.chapters.push(chapterId);
    chapters.push(newChapter);

    res.json(newChapter);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

router.put("/api/chapters/:chapterId", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    const { chapterId } = req.params;
    const { title } = req.body;
    chapters = chapters.map((c) => (c.id !== chapterId ? c : { ...c, title }));
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

// For deletion
router.post("/api/chapters/:chapterId", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    let { seriesId } = req.body;
    let { chapterId } = req.params;

    let targetSeries = series.find((s) => s.id === seriesId);
    targetSeries.chapters = targetSeries.chapters.filter(
      (cid) => cid !== chapterId
    );

    chapters = chapters.filter((c) => c.id !== chapterId);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

module.exports = router;
