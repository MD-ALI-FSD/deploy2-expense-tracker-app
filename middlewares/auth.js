const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

// Import the variable from loginController.js file
// const importedToken = require("../backend/controller/loginController");

exports.authenticate = (req, res, next) => {
  try {
    //token recived from the header of the GET request
    const token = req.header("Authorization");

    //decrypting tokenised user-id
    const user = jwt.verify(token, "69EdyIEvGh2Dj2jlihmhOhZ9S2VwvGMb");

    //checking the user table for a user with this user-id
    userModel
      .findByPk(user.userId)
      .then((user) => {
        //converting object type data recived into JSON type whis is more readable

        req.user = user;

        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};
