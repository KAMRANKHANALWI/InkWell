const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { createTokenForUser } = require("../services/auth");

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createTokenForUser(user);
      // res.json({ token });
      // Set the token in a cookie
      res.cookie("token", token);
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleUserRegister(req, res) {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }
    // validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 4) {
      return res
        .status(400)
        .json({ message: "Please enter a stronger password" });
    }
    // hashing user password
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    
    // AGAIN CREATE TOKEN AND SENDING AS A COOKIE  SO THAT USER GET LOGGEDIN AFTER SIGNUP
    // const token = createTokenForUser(user);
    // Set the token in a cookie
    // res.cookie("token", token);
    // res.json({ success: true, token._id });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleUserLogin,
  handleUserRegister,
};
