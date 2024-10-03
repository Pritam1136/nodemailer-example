const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET;
let otpStore = {};

// Function to send OTP
const sendOtp = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  // Create transporter for nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h1>OTP Verification</h1>
      <p>Your OTP code is <strong>${otp}</strong>.</p>
      <p>Please use this code to verify your account.</p>
      <p>If you did not request this OTP, please ignore this email.</p>
    `,
  };
  console.log("send otp");

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending OTP" });
    }
    res.status(200).json({ message: `OTP sent to ${email}`, info });

    // Clear OTP after 10 minutes
    setTimeout(() => {
      delete otpStore[email];
    }, 600000); // 10 minutes
  });
};

// Function to verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    // OTP is correct, generate a JWT token
    const token = jwt.sign({ email }, secretKey, {
      expiresIn: "1h",
    });

    delete otpStore[email]; // Clear OTP after successful login
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid OTP" });
  }
};

module.exports = { sendOtp, verifyOtp };
