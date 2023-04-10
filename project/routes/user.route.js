const userRouter = require('express').Router()
const passport = require('passport')
const userController = require('../controllers/user.controller')

userRouter.get("/getBalance/me" , async(req , res ) => {
   res.status(200).json({ coinBalance : await userController.getBalanceByUserId(req.user._id) }) 
}
    )


module.exports = userRouter