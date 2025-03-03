const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is imported

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: `User not found with id of ${req.params.id}` });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).send({ message: "User already exists" });
  }
  const newUser = await User.create(req.body);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide an email and password" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  console.log("getMe user:", user); // Debug
  res.status(200).json(user);
});

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Please provide your password" });
  }
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid password" });
  }
  await User.findByIdAndDelete(userId);
  res.status(200).json({ success: true, message: "Account deleted successfully" });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, password } = req.body;

  console.log("updateUser request body:", req.body); // Debug input

  const updateData = {};
  if (name) updateData.name = name;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
    console.log("Password hashed:", updateData.password); // Debug hash
  }
  if (req.file) updateData.image = req.file.filename;

  console.log("Updating user with data:", updateData); // Debug before update

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: `User not found with id of ${userId}` });
  }

  console.log("Updated user:", user); // Debug output
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};