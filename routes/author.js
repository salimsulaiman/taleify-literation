const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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

const checkEmailExist = async (email) => {
  const emailExist = await Author.findOne({ email });
  return emailExist !== null;
};

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // check if email already exists
  const emailExist = await checkEmailExist(email);

  if (emailExist) {
    return res
      .status(400)
      .json({ status: "EXIST", message: "Email already exists" });
  }

  try {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const author = new Author({
      name,
      email,
      password: hashPassword,
    });

    const saveAuthor = await author.save();
    res.json(saveAuthor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to register",
    });
  }
});

module.exports = router;
