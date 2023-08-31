const { expressjwt: jwt } = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", 
  getToken: (req) => {
    console.log(req.headers)

    if (req.headers === undefined || req.headers.authorization === undefined) {
      console.log("Token no entregado")
      return null
    }

    const tokenArr = req.headers.authorization.split(" ")
    // const [ tokenType, token ] = tokenArr
    const tokenType = tokenArr[0]
    const token = tokenArr[1]

    if (tokenType !== "Bearer") {
      console.log("Tipo de token no valido")
      return null
    }

    console.log("Token entregado")
    return token
    
  }
})

module.exports = isAuthenticated
