const mongoose = require("mongoose");

const userLiterationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    literation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Literation",
    },
    status: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserLiteration", userLiterationSchema);
