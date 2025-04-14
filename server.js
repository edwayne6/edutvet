const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");
const nodemailer = require("nodemailer"); // For sending emails
const bcrypt = require("bcrypt"); // For password hashing

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

// Forgot Password Route
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // Generate a password reset token (for simplicity, using email as a token here)
  const resetToken = Buffer.from(email).toString("base64");

  // Send password reset email
  const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error sending email" });
  }
});

// Reset Password Route
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  // Decode the token to get the email
  const email = Buffer.from(token, "base64").toString("ascii");

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "Invalid or expired token" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ msg: "Password reset successful" });
});

// Sign-up Route
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ msg: "User registered successfully" });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  res.json({ msg: "Login successful", user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
