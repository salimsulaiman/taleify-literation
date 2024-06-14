const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    literation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Literation",
    },
    subTitle: String,
    story: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", storySchema);
