const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const jwt = require("jsonwebtoken")
const isAuthenticated = require("../middlewares/isAuthenticated")

// POST "/api/auth/signup" => registrar al usuario
router.post("/signup", async (req, res, next) => {

  const { username, email, password } = req.body
  console.log(req.body)

  // 1. validaciones.
  // - los campos llenos
  // - que nombre tenga un formato especifico
  // - que la constraseña o email tenga un formato especifico
  // - que el usuario no esté repetido

  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "Todos los campos deben estar llenos" })
    return;
  }

  try {
    // 2. encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    console.log(hashPassword)
  
    // 3. crear el usuario en la DB
    await User.create({
      username,
      email,
      password: hashPassword,
      // isActive: false,
      // verifyPassword: "1234"
    })
  
    // "https://mipagina.com/verify-user/idUser/1234"

    res.json("usuario creado")
    
  } catch (error) {
    next(error)
  }


})

// POST "/api/auth/login" => validar las credenciales ...aqui creamos la sesión
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body
  console.log(req.body)

  // 1. Todas las validaciones

  try {
    //  - Que el usuario exista
    const foundUser = await User.findOne({ email })
    console.log(foundUser)
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "Usuario no registrado" })
      return;
    }

    //  - Que la contraseña sea correcta
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    if (isPasswordValid === false) {
      res.status(400).json({ errorMessage: "Contraseña no valida" })
      return;
    }
    
  
    // ... crear la sesión.
    // Pero ahora haremos sistema de Tokens

    // En el payload agregamos información que no deberia cambiar del usuario
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      // si tuvieramos roles, tienen que ir acá
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


// GET "/api/auth/verify" => indicar al FE que el usuario está activo en llamadas futuras
router.get("/verify", isAuthenticated, (req, res, next) => {

  // ! de ahora en adelante, cada vez que usemos el middleware isAuthenticated ...
  // ! ... vamos a tener acceso a algo llamado req.payload
  console.log(req.payload)

  res.json(req.payload)

})



module.exports = router;
