// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 2468;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const server = require("http").Server(app);
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

const User = require("./models/user");

app.use(morgan("dev"));
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// connect to mongodb
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

//handle mongo error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connectedto mongo!");
});

const databaseHelperFunctions = require("./routes/helpers")(db);

const usersRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");

app.use("/users", usersRoutes(databaseHelperFunctions));
app.use("/chat", chatRoutes(databaseHelperFunctions));

app.get("/", function (req, res) {
  res.send("We out here!");
});

app.post("/register", function (req, res) {
  const { firstName, lastName, email, username, password } = req.body.inputs;
  // const hashedPassword = bcrypt.hashSync(password, 10);
  const userData = {
    firstName,
    lastName,
    email,
    username,
    password,
    // password: hashedPassword,
  };
  User.create(userData, function (error, user) {
    if (error) {
      return error;
    } else {
      req.session.userId = user._id;
      return res.json(user);
    }
  });
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  console.log("password", password);
  User.findOne({ username: username }).exec((err, user) => {
    if (err) {
      return err;
    }
    bcrypt.compare(password, user.password, function (err, result) {
      console.log("result", result);
      console.log("user.password", user.password);
      if (result === true) {
        req.session.userId = user._id;
        console.log("useId", req.session.userId);
        return res.json(user);
      } else {
        console.log("Not logged in!", user);
        return err;
      }
    });
  });
});
app.post("/logout", function (req, res) {
  req.session.userId = null;
  return res.json("destroy");
});

// app.get("/users/", (req, res) => {
//   const { userId, user } = req.query;
//   console.log("userId", userId);
//   console.log("receiver", user);

//   databaseHelperFunctions.findUser(userId, user);
// });

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
