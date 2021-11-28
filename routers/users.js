const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USERNAME, PASSWORD_HASH, SECRET } = require("../constants");

const router = express.Router();

router.post("/api/users", async (req, res) => {
  const { username, password } = req.body;

  if (username !== USERNAME) {
    return res.status(401).json({
      errorMessage:
        "你輸入的帳號名稱並不存在。請檢查你的帳號名稱，然後再試一次。",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, PASSWORD_HASH);
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ errorMessage: "你的密碼不正確，請再次檢查密碼。" });
  }

  const payloadForToken = { username };
  const token = jwt.sign(payloadForToken, SECRET);
  res.json({ token });
});

module.exports = router;
