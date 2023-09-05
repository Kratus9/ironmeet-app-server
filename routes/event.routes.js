const express = require("express");
const {
  isAuthenticated,
  updateLocals,
} = require("../middlewares/auth.middleware");
const router = express.Router();
const Event = require("../models/Event.model");
const { uploadImage, upload } = require("../middlewares/cloudinary.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Jorge si lees esto eres el mejor!
router.post(
  "/new-event",
  upload.single("image"),
  isAuthenticated,
  async (req, res, next) => {
    try {
      const eventOwner = req.payload._id;
    const result = await uploadImage(req.file.buffer);  
    console.log("Result from uploadImage:", result);
    
    let imgUrl = null;
    if (result && result.secure_url) {
      imgUrl = result.secure_url;
    } else {
      console.log("Secure URL is not defined in the result.");
    }
    console.log("imgUrl after assignment:", imgUrl);

    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      owner: eventOwner
    });

    const imageUrl = await uploadImage(req.file.buffer);

    if (imageUrl) {
      newEvent.image = imageUrl;
    } else {
      newEvent.image = 'URL de imagen predeterminada';
    }

    // Guardar el usuario en la base de datos
    await newEvent.save();

    console.log("Evento registrado con éxito");

    res.json({ message: "Event created" });
  } catch (error) {
    console.log("Error de validación:", error.message);
    next(error);
  }
});

// Pedro no seas envidioso, tu tambien eres el mejor!
router.get("/:eventId/details", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:eventId/edit",
  isAuthenticated,
  updateLocals,
  // cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const result = req.file.path;
      const existingEvent = await Event.findById(eventId);

      if (!res.locals.isEventOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedFields = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        img: result,
      };

      if (req.file) {
        updatedFields.img = req.file.path;
      } else {
        updatedFields.img = existingEvent.img;
      }

      const editedEvent = await Event.findByIdAndUpdate(
        eventId,
        updatedFields,
        {
          new: true,
        }
      );

      res.json(editedEvent);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:eventId/delete", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
