require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const path = require("path");
const passport = require("passport");
const ejs = require("ejs");
const cors = require("cors");

require("./config/passport.config");
//routes
<<<<<<< HEAD
const authRoute = require("./routes/auth.route.js");
const paymentRoute = require("./routes/payment.route");
const userRoute = require("./routes/user.route");
=======
const authRoute = require('./routes/auth.route.js'); 
const paymentRoute = require('./routes/payment.route')
const userRoute = require('./routes/user.route');
const serviceRouter = require('./routes/services.route');
>>>>>>> 7c601b0ef189f3dd35c1cf11ad5c83dea58fce00

require("./config/mongoDB.config");

const app = express();
const PORT = process.env.PORT || 3333;
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use(cookieParser());
=======

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended : true}))

app.use(cookieParser())
>>>>>>> 7c601b0ef189f3dd35c1cf11ad5c83dea58fce00
app.use(
  session({
    store: MongoDBStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.post("/", (req, res) => {
  console.log("its working");
  res.json({ message: "booom" });
});
app.use("/api/v1/", authRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/", userRoute);

<<<<<<< HEAD
app.get("/", (req, res) => {
  console.log("i am in side my server");
  res.send("boom");
});

const HOSTNAME = process.env.HOSTNAME || "197.206.31.128";
app.listen(PORT, (err, suc) => {
  if (err) throw err;
  console.log(`Server running on ${PORT} port`);
});
=======
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
>>>>>>> 7c601b0ef189f3dd35c1cf11ad5c83dea58fce00
