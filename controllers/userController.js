const mongoose = require("mongoose");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SERECT, { expiresIn: "3d" });
};

const login = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    resp.status(200).json({ email, token });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

const signup = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    resp.status(200).json({ email, token });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

module.exports = {
  login,
  signup,
};
