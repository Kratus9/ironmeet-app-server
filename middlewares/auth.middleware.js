const { expressjwt: jwt } = require("express-jwt");
const Message = require("../models/Message.model");
const Event = require("../models/Event.model");

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

async function updateLocals(req, res, next) {
    try {
      const token = req.header("x-auth-token");
  
      if (!token) {
        // Usuario no autenticado
        res.locals.isUserActive = false;
        res.locals.isEventOwner = false;
        res.locals.isMessageOwner = false;
        res.locals.isGoldMember = false;
        res.locals.isAdmin = false;
        return next();
      }
  
      const authToken = jwt.verify(token, process.env.TOKEN_SECRET); 
      res.locals.isUserActive = true;
      const userRole = authToken.role;
      const userId = authToken._id;
      const { eventId, messageId } = req.params;
      res.locals.localId = userId;
  
      if (userRole === "goldmember") {
        res.locals.isGoldMember = true;
      }
      if (userRole === "admin") {
        res.locals.isAdmin = true;
      }
  
      if (eventId) {
        const event = await Event.findById(eventId);
  
        if (event && userId.toString() === event.owner.toString()) {
          res.locals.isEventOwner = true;
        } else {
          res.locals.isEventOwner = false;
        }
      }
  
      if (messageId) {
        const message = await Message.findById(messageId);
  
        if (message && userId.toString() === message.owner.toString()) {
          res.locals.isMessageOwner = true;
        } else {
          res.locals.isMessageOwner = false;
        }
      }
  
      console.log("isAdmin:", res.locals.isAdmin);
      console.log("isEventOwner:", res.locals.isEventOwner);
      console.log("isMessageOwner:", res.locals.isMessageOwner);
      console.log("isGoldMember:", res.locals.isGoldMember);
  
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  module.exports = { isAuthenticated, updateLocals }