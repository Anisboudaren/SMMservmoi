const authRouter = require('express').Router()
const {getBalanceByUserId} = require('../controllers/user.controller')
const {registerUser} = require("../controllers/user.controller")
const User  = require('../model/user.model')
const Profile = require('../model/profile.model')
const passport = require('passport')
  
authRouter.get('/login' , (req , res)=>{
    res.render('login' , {message : ''})
})
authRouter.post('/login' , 
    passport.authenticate('local') , 
    async (req , res) =>{
        const amount = await getBalanceByUserId(req.user._id )
        res.render("home" ,  {client : `hello , ${req.user.username} , your current balance is : ${amount}`})
    })

authRouter.post('/register' , registerUser )

authRouter.get("/home"  , async (req , res) => {
    console.log("homey")
  if(!req.user) return res.render("home" , {client : "you have to login first"})
  console.log(req.invoice)
  const amount = await getBalanceByUserId(req.user._id )
  res.render("home" ,  {client : `hello , ${req.user.username} , your current balance is : ${amount}`})
  })

module.exports = authRouter
