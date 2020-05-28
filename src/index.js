// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 4000;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const server = require("http").Server(app);
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

app.use(morgan("dev"));
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// connet to mongodb
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connectedto mongo!")
});

app.get("/", function (req, res) {
  res.send("We out here!");
});

// app.put("/register", function (req, res) {
//   const { username, email, password } = req.body
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   // console.log("Hashed password:", hashedPassword);

// });

// const routes = require('./routes/router');
// app.use('/', routes);

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Page not found!)");
});

// error handler
// define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});