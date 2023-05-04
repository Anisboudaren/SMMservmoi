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
const authRoute = require("./routes/auth.route.js");
const paymentRoute = require("./routes/payment.route");
const userRoute = require("./routes/user.route");
const serviceRouter = require("./routes/services.route");

require("./config/mongoDB.config");

const app = express();
const PORT = process.env.PORT || 3333;
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//app.set('trust proxy' , 1);
app.use(
  session({
    store: new MongoDBStore({
      mongoUrl: process.env.MONGO_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "Lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.cookies);
  console.log(req.user); // log the cookies object to the console
  next();
});

app.post("/", (req, res) => {
  console.log("its working");
  res.json({ message: "booom" });
});
app.use("/api/v1/", authRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/service", serviceRouter);

app.get("/", (req, res) => {
  console.log("i am in side my server");
  res.send("boom");
});

app.get("/service", (req, res) => {
  console.log("i am in side my server");
  res.render("service");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} port`);
});
