const express = require("express");
const router = express.Router();

module.exports = databaseHelperFunctions => {
  // post new chat message
  router.post("/send", (req, res) => {
    console.log("post new chat");
  });

  return router;
};
