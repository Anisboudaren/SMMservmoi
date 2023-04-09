const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../model/user.model')

passport.use(
    new Strategy(
        {
            usernameField : 'emailOrUsername'
        } , 
        async (emailOrUsername , password , done) => {
           
          try {
            if(!emailOrUsername || !password){ 
                throw new Error("Bad request , Missing credentials!")
                
           }
            const userDB = await User.findOne(
                { $or : [{email : emailOrUsername} , {username : emailOrUsername}]}
                )
                if(!userDB)  throw new Error("User not found!" , null)
                const matchPass = await userDB.comparePassword(password)
                console.log(matchPass);
                if(!matchPass) done(null , null)
                else {
                    console.log("logged in");
                    done(null , userDB)
                }

          } catch (e) {
            done(e , null)
          }
        }  
    )
    )
passport.serializeUser( (user , done) => {
    console.log("serialize...");
    console.log(user);
    done(null , user._id)
})

passport.deserializeUser(async (id , done) => {
    console.log('deserialize...');
    console.log(id);
    try {
        const user = await User.findOne({ _id : id })
        if(!user) throw new Error("user not found!")
        return done(null , user)
    } catch (e) {
        console.log(e);
        done(e , null)
    }
})