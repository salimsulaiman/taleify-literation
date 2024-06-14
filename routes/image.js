const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../image/profile")); // Store uploaded files in the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use the original filename
  },
});

const upload = multer({ storage: storage });

router.post("/upload_avatar/:id", upload.single("profilePicture"), async (req, res) => {
  const { id } = req.params;
  const { filename } = req.file;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        picture: `http://localhost:3030/image/profile/${filename}`,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error uploading file and updating user picture:", error);
    res.status(500).send("Error uploading file and updating user picture");
  }
});

router.post("/default_avatar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&size=256`,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error uploading file and updating user picture:", error);
    res.status(500).send("Error uploading file and updating user picture");
  }
});

module.exports = router;
