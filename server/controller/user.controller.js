import userService from "../services/user.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";

// Register User-
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password, country } = req.body;
  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: " User already exist" });
  }
  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    username,
    email,
    country,
    password: hashPassword,
  });
  res.status(201).json({ user });
};

// Login user-
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.camparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = user.genAuthToken();
  res.cookie("token", token);
  res.json({ user, token });
};

// Logout user-
const logOutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  return res.status(200).json({ message: "User logged out" });
};

export default { loginUser, registerUser, logOutUser };
