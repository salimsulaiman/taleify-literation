const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const UserPoint = require("../models/UserPoint");
const UserOTPVerification = require("../models/UserOtpVerification");
const { verifyToken } = require("./verifytoken");

// nodemailer
let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

router.get("/", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/userdetail", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await User.findById(userId).select(
      "_id name email picture verified createdAt updatedAt"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id).select(
      "_id name email picture verified createdAt updatedAt"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error",
    });
  }
});
router.get("/get_user/search", async (req, res) => {
  const { email } = req.query;
  try {
    const data = await User.findOne({ email: email });

    if (!data) {
      return res.status(404).json({
        status: res.statusCode,
        message: "Email not found",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Error Bos",
    });
  }
});

const checkEmailExist = async (email) => {
  const emailExist = await User.findOne({ email });
  return emailExist !== null;
};

// register
router.post("/signup", async (req, res) => {
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

    const user = new User({
      name,
      email,
      password: hashPassword,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&size=256`,
      verified: false,
    });

    const saveUser = await user.save();

    if (saveUser) {
      const userId = saveUser._id;
      const userPoint = new UserPoint({
        user: userId,
        point: 0,
      });

      const saveUserPoint = await userPoint.save();

      // Call function to send OTP verification email
      if (saveUserPoint) {
        await sendOTPVerificationEmail({ _id: userId, email: email });
      }

      // Send response after all async operations are completed
      res.status(200).json({ user: saveUser, saveUserPoint });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to register",
    });
  }
});

router.post("/verifyOTP", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Harap masukan kode otp");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        throw Error(
          "Akun tidak tersedia atau mungkin telah terverifikasi. Silahkan daftar atau masuk ke dalam akun"
        );
      } else {
        const { expiredAt } = UserOTPVerificationRecords[0];
        const hashOTP = UserOTPVerificationRecords[0].otp;

        if (expiredAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error(
            "Kode telah kadaluarsa. Silahkan kirim ulang kode verifikasi."
          );
        } else {
          const validOTP = await bcrypt.compare(otp, hashOTP);
          if (!validOTP) {
            throw new Error("Kode verifikasi tidak sesuai. Silahkan cek email");
          } else {
            await User.updateOne(
              {
                _id: userId,
              },
              {
                verified: true,
              }
            );
            await UserOTPVerification.deleteMany({ userId });
            res.json({
              status: "VERIFIED",
              message: "Verifikasi akun berhasil",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

router.post("/resendOTPVerificationCode", async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);

      res.json({
        status: "SUCCESS",
        message: "Email sent successfully",
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // if email exist
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(400).json({
      status: res.statusCode,
      message: "Invalid Email",
    });
  }

  // check password
  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd) {
    return res.status(400).json({
      status: res.statusCode,
      message: "Invalid Password",
    });
  }

  // create token
  const token = jwt.sign(
    {
      _id: user._id,
      iss: "Taleify",
      aud: "frontend",
      exp: parseInt(new Date().getTime() / 1000 + 12 * 60 * 60),
    },
    process.env.SECRET_KEY
  );

  res.header("authuser", token).json({
    id: user._id,
    token: token,
  });
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
    }).then(
      res.status(200).json({
        status: res.statusCode,
        message: "Success",
      })
    );
  } catch (error) {
    console.log(error);
  }
});

router.put("/changePassword/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ status: res.statusCode, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: res.statusCode, message: "Password does not match" });
    }

    await User.findByIdAndUpdate(id, {
      password: hashPassword,
    }).then(
      res.status(200).json({
        status: res.statusCode,
        message: "Success",
      })
    );
  } catch (error) {
    console.log(error);
  }
});

const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // mail option
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            /* CSS Reset */
            body, h1, p {
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
              color: #333333;
              text-align: center;
              margin-bottom: 20px;
            }
            
            .otp-code {
              text-align: center;
              font-size: 36px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 20px;
            }
            
            .expiry-info {
              text-align: center;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Taleify Email Verification</h1>
            <p class="otp-code">${otp}</p>
            <p class="expiry-info">This code expires in 1 hour.</p>
          </div>
        </body>
        </html>`,
    };

    // hash the otp
    const saltRounds = 10;
    const hashOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });

    // save otp record
    await newOTPVerification.save();
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
};

module.exports = router;
