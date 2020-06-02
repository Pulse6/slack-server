const express = require("express");
const router = express.Router();

const User = require("../models/user");

const findUser = user => {
  User.find({ username: { $regex: user } })
    .then(res => {
      if (!res) {
        return [];
      } else {
        console.log("ressss", res);
        return res;
      }
    })
    .catch(error => console.log(error));
};

module.exports = databaseHelperFunctions => {
  // get all users from database
  router.get("/", (req, res) => {
    const { user } = req.query;
    console.log("receiver", user);
    // databaseHelperFunctions.findUser(userId, user);
    findUser(user).then(result => {
      console.log("res from server", result);
      return res.json(result);
    });
  });

  return router;
};