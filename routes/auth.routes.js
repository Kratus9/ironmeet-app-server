const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { uploadImage, upload } = require("../middlewares/cloudinary.middleware");


// POST "/api/auth/signup" => Register
router.post("/signup", upload.single("image"), async (req, res, next) => {
  try {
    console.log("Received request to /signup");
    const { username, email, password, repeatPassword } =
      req.body;
      console.log("req.body:", req.body);

    req.on("data", (chunk) => {
      console.log(`Received data chunk: ${chunk}`);
    });

    req.on("end", () => {
      console.log("End of request data");
    });

    if (!username || !email || !password || !repeatPassword) {
      return res
        .status(400)
        .json({ errorMessage: "All fields must be filled" });
    }

    const regexPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        errorMessage: "The password must contain at least one uppercase letter, one lowercase letter, one special character, and be 8 characters or longer.",
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        errorMessage: "Password and Repeat password do not match.",
      });
    }

    const foundUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser) {
      return res.status(400).json({
        errorMessage: "Username or email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Subir la imagen a Cloudinary y obtener la URL segura

    const result = await uploadImage(req.file.buffer);
    console.log("Result from uploadImage:", result);
    
    let imgUrl = null;
    if (result && result.secure_url) {
      imgUrl = result.secure_url;
    } else {
      console.log("Secure URL is not defined in the result.");
    }
    console.log("imgUrl after assignment:", imgUrl);

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
    });

    
    const imageUrl = await uploadImage(req.file.buffer);

    if (imageUrl) {
      newUser.image = imageUrl;
    } else {
      
      newUser.image = 'URL de imagen predeterminada';
    }

    // Guardar el usuario en la base de datos
    await newUser.save();

    console.log("Usuario registrado con éxito");

    res.json({ message: "User created" });
  } catch (error) {
    console.log("Error de validación:", error.message);
    next(error);
  }
});

// POST "/api/auth/login" => Login and create session
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });
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

module.exports = router