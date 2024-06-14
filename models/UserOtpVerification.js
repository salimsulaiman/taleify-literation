const mongoose = require("mongoose");

const userOTPVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const UserOTPVerification = mongoose.model("UserOTPVerification", userOTPVerificationSchema);

module.exports = UserOTPVerification;
