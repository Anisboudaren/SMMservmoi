const authRouter = require('express').Router()
const User  = require('../model/user.model')
const Profile = require('../model/profile.model')
const passport = require('passport')

async function getBalance(id  ) {
    const result =  await User.findById(id)
    .populate('profileId')
   
    return result.profileId.coinsBalance;
  
  }
  
authRouter.get('/login' , (req , res)=>{
    res.render('login' , {message : ''})
})
authRouter.post('/login' , passport.authenticate('local') , async (req , res) =>{
    const amount = await getBalance(req.user._id )
    console.log("this guys balance is " ,amount);
    res.redirect('/home')
})

authRouter.post('/register' , async (req , res) =>{

   const { username , email  , password , firstName , lastName , role} = req.body ;
    const user = await User.findOne({ $or : [ { email } , { username }]})
if(user){
    res.status(400).render("login" , {message : "email or username already has been used"})
} else {
    const newProfile = await Profile.create({firstName , lastName })
    const newUser = await User.create({username , email , password , profileId : newProfile._id , role})
    res.status(201).render("login"  , { message : "your user has been added try to log in " + newUser })
}
})

module.exports = authRouter
