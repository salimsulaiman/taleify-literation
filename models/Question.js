const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
    question: String,
    answer: Array,
    correct_answer: String,
    point: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
