const express = require("express");
const cors = require("cors");
const { getCurrentTimeString } = require("./utils");
const seriesRouter = require("./routers/series");
const chaptersRouter = require("./routers/chapters");
const articlesRouter = require("./routers/articles");
const usersRouter = require("./routers/users");

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

app.use("/", seriesRouter);
app.use("/", chaptersRouter);
app.use("/", articlesRouter);
app.use("/", usersRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
