const User = require("../models/user");

module.exports = db => {
  // *********** HELPER FUNCTIONS FOR CHAT ROUTES ************
  const findUser = (userId, user) => {
    User.find({ username: { $regex: user } }).then(res => {
      console.log("data", res);
      return res.json(res);
    });
  };

  const sendMsg = () => {};

  return {
    findUser,
    sendMsg,
  };
};
