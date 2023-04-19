 require('dotenv').config()
const express = require('express') 
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongo');
const path = require('path')
const passport = require('passport')
const ejs = require('ejs')


require("./config/passport.config")
//routes
const authRoute = require('./routes/auth.route.js'); 
const paymentRoute = require('./routes/payment.route')
const userRoute = require('./routes/user.route');
const serviceRouter = require('./routes/services.route');


require('./config/mongoDB.config')


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended : true}))

app.use(cookieParser())
app.use(
  session({
    store : MongoDBStore.create({ mongoUrl : process.env.MONGO_URL}) , 
    secret : process.env.SESSION_SECRET , 
    resave : false , 
    saveUninitialized : false
  })
);
app.use(passport.initialize())
app.use(passport.session())

//ROUTES 

app.use('/api/v1/' , authRoute); 
app.use('/api/v1/payment' , paymentRoute)
app.use('/api/v1/' , userRoute)
app.use("/api/v1/service" , serviceRouter)
app.get("/" , (req , res)=>{
  console.log("i am in side my server");
  res.render("service")
})

const HOSTNAME = process.env.HOSTNAME || '197.206.31.128'
app.listen(PORT , (err, suc) => {
    if (err) throw err;
    console.log(`Server running on ${PORT} port`);
  });