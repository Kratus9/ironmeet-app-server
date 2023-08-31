const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const jwt = require("jsonwebtoken")
const isAuthenticated = require("../middlewares/isAuthenticated")

// POST "/api/auth/signup" => Register
router.post("/signup", async (req, res, next) => {

  const { username, email, password } = req.body
  console.log(req.body)

  //************
  // 1. validaciones.
  // - los campos llenos
  // - que nombre tenga un formato especifico
  // - que la constraseña o email tenga un formato especifico
  // - que el usuario no esté repetido

  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "All fields must be filled" })
    return;
  }

  try {
    //Encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    console.log(hashPassword)
  
    // 3. Creates the user in the DB
    await User.create({
      username,
      email,
      password: hashPassword,

    })
  

    res.json("user created")
    
  } catch (error) {
    next(error)
  }


})

// POST "/api/auth/login" => validar las credenciales ...aqui creamos la sesión
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body
  console.log(req.body)

  // 1. Validations

  try {
    //  - User exists?
    const foundUser = await User.findOne({ email })
    console.log(foundUser)
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "User is not registered" })
      return;
    }

    //  - Password correct?
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    if (isPasswordValid === false) {
      res.status(400).json({ errorMessage: "Password invalid" })
      return;
    }
    
  
    // .Session created
 

    // Info that must not be changed
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      // si tuvieramos roles, tienen que ir acá*********
    }
  
    const authToken = jwt.sign( 
      payload,
      process.env.TOKEN_SECRET,
      { algorithm: "HS256", expiresIn: "3d" }
    )

    res.json({ authToken })
    
  } catch (error) {
    next(error)
  }

})


// GET "/api/auth/verify" => Tells FE if user is active
router.get("/verify", isAuthenticated, (req, res, next) => {


  console.log(req.payload)

  res.json(req.payload)

})



module.exports = router;
