const mongoose = require("mongoose");

const userAnswerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    userAnswer: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
