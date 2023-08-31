const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/auth.middleware")

// POST "/api/auth/signup" => Register
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, repeatPassword, location, birthday } = req.body;

    if (!username || !email || !password || !repeatPassword) {
      return res.status(400).json({ errorMessage: "All fields must be filled" });
    }

    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        errorMessage: "The password must have specific requirements."
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        errorMessage: "Password and Repeat password do not match."
      });
    }

    const foundUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (foundUser) {
      return res.status(400).json({
        errorMessage: "Username or email already exists."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashPassword,
      birthday,
      location
    });

    res.json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => Login and create session
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "3d"
    });

    res.json({ authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Verify user's active status
router.get("/verify", isAuthenticated, (req, res) => {
  res.json(req.payload);
});

module.exports = router;

