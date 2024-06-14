const express = require("express");
const router = express.Router();

const Author = require("../models/Author");

router.get("/", async (req, res) => {
  try {
    const data = await Author.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

module.exports = router;
