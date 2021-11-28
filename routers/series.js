const express = require("express");
let series = require("../data/series");
const { extractTokenFromRequest, generateId } = require("../utils");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../constants");

const router = express.Router();

router.get("/api/series", (req, res) => {
  res.json(series);
});

router.post("/api/series", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    const id = generateId();
    const { title, showChapterButtons } = req.body;

    const newSeries = {
      id,
      title,
      anchor: id,
      showChapterButtons,
      chapters: [],
    };
    series.push(newSeries);

    res.json(newSeries);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

router.put("/api/series/:seriesId", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    const { seriesId } = req.params;
    const { title, showChapterButtons } = req.body;
    series = series.map((s) =>
      s.id !== seriesId ? s : { ...s, title, showChapterButtons }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

router.delete("/api/series/:seriesId", (req, res) => {
  try {
    const token = extractTokenFromRequest(req);
    const decodedToken = jwt.verify(token, SECRET);
    if (!token || !decodedToken) {
      return res.status(401).json({ errorMessage: "invalid token" });
    }

    const { seriesId } = req.params;
    series = series.filter((s) => s.id !== seriesId);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Server-side error" });
  }
});

module.exports = router;
