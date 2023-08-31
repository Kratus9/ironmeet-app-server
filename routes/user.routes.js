const express = require('express');
const router = express.Router();
const cloudinaryMulter = require("../middlewares/cloudinary.middleware");
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const Message = require("../models/Message.model");

const {
  isAuthenticated,
  updateLocals,
} = require("../middlewares/auth.middleware.js");

// Importa el middleware de Cloudinary
const uploader = require("../middlewares/cloudinary.middleware.js");

// Ruta para mostrar el perfil del usuario
router.get("/user/profile", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    res.json(user)
  } catch (error) {
    next(error);
  }
});

// Ruta para editar perfil
router.patch("/user/profile/update",
  cloudinaryMulter.single("img"),
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

// Ruta para mostrar las recetas favoritas del usuario
router.get("/:userId/messages", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const user = await User.findById(userId).populate("messages");
    const messages = user.messages;
    
    res.json(messages)
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

// // Ruta para agregar o eliminar una patata de las favoritas del usuario
// router.post(
//   "/addOrRemoveFavPotatoes/:potatoId",
//   isLoggedIn,
//   async (req, res, next) => {
//     try {
//       const userId = req.session.user._id;
//       const potatoId = req.params.potatoId;

//       const user = await User.findById(userId);

//       const isFavorite = user.favPotatoes.includes(potatoId);

//       if (!isFavorite) {
//         await User.findByIdAndUpdate(userId, {
//           $push: { favPotatoes: potatoId },
//         });
//       } else {
//         await User.findByIdAndUpdate(userId, {
//           $pull: { favPotatoes: potatoId },
//         });
//       }

      
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // Ruta para agregar o eliminar una receta de las favoritas del usuario
// router.post(
//   "/addOrRemoveFavRecipes/:recipeId",
//   isLoggedIn,
//   async (req, res, next) => {
//     try {
//       const userId = req.session.user._id;
//       const recipeId = req.params.recipeId;

//       const user = await User.findById(userId);

//       const isFavorite = user.favRecipes.includes(recipeId);

//       if (!isFavorite) {
//         await User.findByIdAndUpdate(userId, {
//           $push: { favRecipes: recipeId },
//         });
//       } else {
//         await User.findByIdAndUpdate(userId, {
//           $pull: { favRecipes: recipeId },
//         });
//       }

      
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;