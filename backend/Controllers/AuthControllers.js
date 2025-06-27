const mongoose = require("mongoose");
const UserModel = require("../models/AuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { EmployeeSchema } = require("../models/EmployeeModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SEC_Key,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Logged In Successfully.",
      logintoken: token,
      name: user.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists." });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await new UserModel({
      name,
      email,
      password: hashPassword,
    }).save();

    const collectionName = `employees_${newUser._id}`;
    if (!mongoose.models[collectionName]) {
      mongoose.model(collectionName, EmployeeSchema);
    }

    const existing = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();
    if (existing.length === 0) {
      await mongoose.connection.createCollection(collectionName);
    }

    return res
      .status(201)
      .json({ success: true, message: "User Created Successfully." });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error: " + error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

module.exports = { login, register, logout };
