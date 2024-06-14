const express = require("express");
const router = express.Router();

const Story = require("../models/Story");

router.get("/", async (req, res) => {
  try {
    const data = await Story.find({}).populate({
      path: "literation",
      select: "_id title",
    });
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
    const data = await Story.findById(req.params.id)
      .populate({
        path: "literation",
        select: "_id title",
      })
      .exec();
    if (!data) {
      return res.status(404).json({
        status: res.statusCode,
        message: "Story not found",
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

router.get("/literation/:id", async (req, res) => {
  try {
    const data = await Story.find({ literation: req.params.id })
      .populate({
        path: "literation",
        select: "_id title",
      })
      .exec();
    if (!data) {
      return res.status(404).json({
        status: res.statusCode,
        message: "Story not found",
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

router.post("/", async (req, res) => {
  const { literation, subTitle, story } = req.body;

  const data = new Story({
    literation,
    subTitle,
    story,
  });

  try {
    const saveStory = await data.save();
    res.json(saveStory);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create story",
    });
  }
});

module.exports = router;
