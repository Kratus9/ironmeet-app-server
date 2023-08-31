const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const userRouter = require("./user.routes")
router.use("/user", userRouter)

const eventRouter = require("./event.routes")
router.use("/event", eventRouter)

const messageRouter = require("./message.routes")
router.use("/message", messageRouter)

module.exports = router;
