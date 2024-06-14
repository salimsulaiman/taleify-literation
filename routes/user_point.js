const express = require("express");
const UserPoint = require("../models/UserPoint");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await UserPoint.find({}).populate({
      path: "user",
      select: "_id name email",
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
    const data = await UserPoint.find({ user: req.params.id }).populate({
      path: "user",
      select: "_id name email",
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  const { point } = req.body;
  try {
    const data = await UserPoint.findOne({ user: req.params.id }).populate({
      path: "user",
      select: "_id name email",
    });

    await UserPoint.updateOne(
      { user: req.params.id },
      {
        point: data.point + point,
      }
    );
    res.status(200).json({
      message: "Success Update",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
      error,
    });
  }
});
module.exports = router;
