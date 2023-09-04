const express = require("express");
const router = express.Router();
const cloudinaryMulter = require("../middlewares/cloudinary.middleware");
const User = require("../models/User.model");
const {
  isAuthenticated,
  updateLocals,
} = require("../middlewares/auth.middleware.js");
const Message = require("../models/Message.model");

// Ruta para mostrar el perfil del usuario
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Ruta para editar perfil
router.patch(
  "/profile/update",
  isAuthenticated,
  //  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para acceder al perfil de otra persona

router.get("/:userId/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});



router.get("/swipe", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const currentUser = await User.findById(userId);
    const filterCriteria = {
      gender: currentUser.preferences,
      location: currentUser.location,
      _id: { $nin: [...currentUser.fanOf, userId] },
    };

    const filteredUsers = await User.find(filterCriteria);

    res.json(filteredUsers);
  } catch (error) {
    next(error);
  }
});

// Ruta para dar like o dislike a un usuario
router.post(
  "/swipe/:userId/:action",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.payload._id;
      const { userId: targetUserId, action } = req.params;

      if (action !== "like" && action !== "dislike") {
        return res.status(400).json({ message: "Invalid action" });
      }

      if (userId === targetUserId) {
        return res.status(400).json({ message: "Cannot swipe on yourself" });
      }

      const currentUser = await User.findById(userId);

      if (action === "like") {
        await User.findByIdAndUpdate(userId, {
          $push: { fanOf: targetUserId },
        });
      }

      const usersToSwipe = await User.find({
        gender: currentUser.preferences,
        location: currentUser.location,
        _id: { $nin: [...currentUser.fanOf, userId] },
      });

      if (usersToSwipe.length > 0) {
        res.json(usersToSwipe);
      } else {
        res.json({ message: "No more users to swipe" });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para mostrar los mensajes de los matches del usuario
router.get("/matches/:messageId", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const messageId = req.params.messageId;

    // Buscar un mensaje entre el usuario actual y la persona con la que hicieron match
    const message = await Message.findOne({
      $or: [
        {
          sender: userId,
          destiny: messageId,
        },
        {
          sender: messageId,
          destiny: userId,
        },
      ],
    });

    if (!message) {
      // Si no existe un mensaje, crea uno nuevo
      const newMessage = new Message({
        text: '', // Puedes agregar un mensaje de inicio si lo deseas
        owner: userId,
        destiny: messageId,
      });
      await newMessage.save();

      // Redirige a la página de chat con el nuevo mensaje creado
      res.redirect(`/matches/${newMessage._id}`);
    } else {
      // Si existe un mensaje, redirige a la página de chat con el mensaje existente
      res.redirect(`/matches/${message._id}`);
    }
  } catch (error) {
    next(error);
  }
});

// Ruta para mostrar los matches del usuario
router.get("/matches", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const users = await User.find({
      fanOf: {
        $in: [userId],
      },
    });

    const matches = [];
    for (const user of users) {
      if (user.fanOf.includes(userId)) {
        matches.push(user);
      }
    }

    res.json(matches);
  } catch (error) {
    next(error);
  }
});

// Ruta para agregar o eliminar un evento del usuario
router.post(
  "/addOrRemoveFavEvent/:eventId",
  isAuthenticated,
  async (req, res, next) => {
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
  }
);

module.exports = router;
