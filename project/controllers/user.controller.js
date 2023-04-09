const bcrypt = require('bcrypt')
const users = []

const login = (email , password) => {

}

const register = async (req , res , next ) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password , 10)
        users.push({
            id : Date.now().toString() , 
            email : req.body.email , 
            name : req.body.name , 
            password : hashedPassword
        })
        console.log("you are registered")  
    } catch (e) {
        console.log("something went wrong")

    }
    next()
}


module.exports = {
    register , 
    users
}