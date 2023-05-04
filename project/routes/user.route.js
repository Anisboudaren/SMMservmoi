const userRouter = require("express").Router();
const passport = require("passport");
const { getBalanceByUserId } = require("../controllers/user.controller");

userRouter.get("/getBalance/me", async (req, res) => {
  try {
    console.log("i am in the balance request this is the user : " + req.user);
    const amount = await getBalanceByUserId(req.user._id);
    console.log("and this is the amount" + amount);
    res.status(200).json({ coinBalance: amount });
  } catch {
    (e) => {
      res.json({ err: e, result: false });
    };
  }
});

module.exports = userRouter;
