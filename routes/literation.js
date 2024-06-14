const express = require("express");
const router = express.Router();

const Literation = require("../models/Literation");

router.post("/", async (req, res) => {
  const { title, picture, author, rating, desc } = req.body;

  function stringToSlug(str) {
    str = str.trim().toLowerCase();

    str = str.replace(/\s+/g, "-");

    str = str.replace(/[^\w-]/g, "");

    return str;
  }

  const data = new Literation({
    title,
    slug: stringToSlug(title),
    picture,
    author,
    genre,
    rating,
    desc,
  });

  try {
    const saveLiteration = await data.save();
    res.json(saveLiteration);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create literation",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Literation.find({}).populate("author").populate("genre");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { title } = req.query;

    const data = await Literation.find({ slug: { $regex: title, $options: "i" } })
      .populate("author")
      .populate("genre");
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
    const data = await Literation.findById(req.params.id).populate("author").populate("genre").exec();
    if (!data) {
      return res.status(404).json({
        status: res.statusCode,
        message: "Literation not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

module.exports = router;
