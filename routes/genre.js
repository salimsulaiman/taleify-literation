const express = require("express");
const router = express.Router();

const Genre = require("../models/Genre");

router.get("/", async (req, res) => {
  try {
    const data = await Genre.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Genre.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

module.exports = router;
