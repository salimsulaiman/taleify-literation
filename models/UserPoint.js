const mongoose = require("mongoose");

const userPointSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    point: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPoint", userPointSchema);
