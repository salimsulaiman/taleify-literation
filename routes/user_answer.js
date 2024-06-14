const express = require("express");
const router = express.Router();

const UserAnswer = require("../models/UserAnswer");
const User = require("../models/User");
const Question = require("../models/Question");
const { verifyToken } = require("./verifytoken");

router.post("/", verifyToken, async (req, res) => {
  const { user, question, userAnswer } = req.body;

  const data = new UserAnswer({
    user,
    question,
    userAnswer,
  });

  try {
    const saveUserAnswer = await data.save();
    res.json(saveUserAnswer);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user answer",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await UserAnswer.find({})
      .populate({
        path: "user",
        select: "_id name email",
      })
      .populate({
        path: "question",
        select: "_id story question answer correct_answer",
        populate: {
          path: "story",
          select: "_id literation story",
        },
      });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const data = await UserAnswer.find({ user: req.params.userId })
      .populate({
        path: "user",
        select: "_id name email",
      })
      .populate({
        path: "question",
        select: "_id story question answer correct_answer",
        populate: {
          path: "story",
          select: "_id literation story",
        },
      });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/:userId/:questionId", async (req, res) => {
  try {
    const data = await UserAnswer.findOne({
      user: req.params.userId,
      question: req.params.questionId,
    })
      .populate({
        path: "user",
        select: "_id name email",
      })
      .populate({
        path: "question",
        select: "_id story question answer correct_answer",
        populate: {
          path: "story",
          select: "_id literation story",
        },
      });
    if (!data) {
      return res.status(200).json({
        userAnswer: null,
      });
    }
    res.status(200).json({ userAnswer: data });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

module.exports = router;
