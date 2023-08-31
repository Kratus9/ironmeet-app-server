const express = require("express");
const {
  isAuthenticated,
  updateLocals,
} = require("../middlewares/auth.middleware");
const router = express.Router();
const Event = require("../models/Event.model");
const cloudinaryMulter = require("../middlewares/cloudinary.middleware");

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
  isAuthenticated,
  updateLocals,
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const result = req.file.path;
      const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        img: result,
      });

      await Event.create(newEvent);
      res.json({ message: "Event created" });
    } catch (error) {
      next(error);
    }
  }
);
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
  cloudinaryMulter.single("img"),
  async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const result = req.file.path;
      const existingEvent = await Event.findById(eventId);

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
