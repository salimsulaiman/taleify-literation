const mongoose = require("mongoose");

const literationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      max: 255,
    },
    slug: {
      type: String,
      required: true,
      max: 255,
    },
    picture: {
      type: String,
      required: true,
      max: 50,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
    rating: {
      type: Number,
      default: 0,
    },
    desc: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Literation", literationSchema);
