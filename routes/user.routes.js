const express = require('express');
const router = express.Router();
const cloudinaryMulter = require("../middlewares/cloudinary.middleware");
const User = require("../models/User.model");
const { isAuthenticated, updateLocals } = require("../middlewares/auth.middleware.js");

// Importa el middleware de Cloudinary
const uploader = require("../middlewares/cloudinary.middleware.js");

// Ruta para mostrar el perfil del usuario
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    res.json(user)
  } catch (error) {
    next(error);
  }
});

// Ruta para editar perfil
router.patch("/profile/update", isAuthenticated, cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      res.json(updatedUser)
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para mostrar los mensajes de los matches del usuario
router.get("/:matchId/messages", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const matchId = req.params.matchId;
  
      const user = await User.findById(userId).populate("messages");
      
      const messagesWithMatch = user.messages.filter(message => {
        return (
          (message.sender.toString() === userId && message.receiver.toString() === matchId) ||
          (message.sender.toString() === matchId && message.receiver.toString() === userId)
        );
      });
  
      res.json(messagesWithMatch);
    } catch (error) {
      next(error);
    }
  });

// Ruta para mostrar los matches del usuario
router.get("/:userId/matches", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const users = await User.find({
        fans: {
          $in: [userId]
        }
      });
  
      const matches = [];
      for (const user of users) {
        if (user.fans.includes(userId)) {
          matches.push(user);
        }
      }
  
      res.json(matches);
    } catch (error) {
      next(error);
    }
  });

// Ruta para agregar o eliminar un evento del usuario
router.post("/addOrRemoveEvent/:eventId", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const eventId = req.params.eventId;
  
      const user = await User.findById(userId);
  
      const isListed = user.events.includes(eventId);
  
      if (!isListed) {
        await User.findByIdAndUpdate(userId, {
          $push: { events: eventId },
        });
        res.json({ message: "Event added to user's list" });
      } else {
        await User.findByIdAndUpdate(userId, {
          $pull: { events: eventId },
        });
        res.json({ message: "Event removed from user's list" });
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = router;