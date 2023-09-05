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

router.patch(
  "/:userId/profile/update",
  isAuthenticated,
  //  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
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
router.get(
  "/messages/:senderId/:receiverId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const senderId = req.params.senderId;
      const receiverId = req.params.receiverId;

      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  }
);

router.post(
  "/messages/new-message",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { sender, receiver, text } = req.body;

      
      const newMessage = new Message({
        sender,
        receiver,
        text,
      });

      
      await newMessage.save();

      
      res.json(newMessage);
    } catch (error) {
      next(error);
    }
  }
);

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

router.get("/likedBy", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;

    const currentUser = await User.findById(userId);
    
    
    const usersLikedBy = await User.find({ fanOf: userId });

    
    const usersWhoLikedYou = usersLikedBy.filter((user) => {
      return !currentUser.fanOf.includes(user._id);
    });

    res.json(usersWhoLikedYou);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting users who liked you" });
  }
});

router.patch("/:userId/like", isAuthenticated, async (req, res, next) => {
  try {
    const activeUserId = req.payload._id;
    const { userId } = req.params;

    
    const currentUser = await User.findById(activeUserId);
    if (!currentUser.fanOf.includes(userId)) {
      
      await User.findByIdAndUpdate(activeUserId, {
        $push: { fanOf: userId },
      });
    }

    res.json({ message: "Chat started successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
