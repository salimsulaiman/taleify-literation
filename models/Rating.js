const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    literation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Literation",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", ratingSchema);
