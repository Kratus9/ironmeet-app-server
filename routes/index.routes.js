const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes.js");
router.use("/auth", authRouter);

const userRouter = require("./user.routes.js");
router.use("/user", userRouter);

const eventRouter = require("./event.routes.js");
router.use("/events", eventRouter);

module.exports = router;