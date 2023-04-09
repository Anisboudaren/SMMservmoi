const mongoose = require('mongoose');

const dbConnection = "mongodb+srv://anis2:anis2002@memoire.s7cv1sa.mongodb.net/servmoi?retryWrites=true&w=majority";

mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((suc) => console.log("Connected to db"))
  .catch((err) => console.log("Error occurred while connecting to db", err));
