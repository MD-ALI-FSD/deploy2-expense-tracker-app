//Importing "Product" model to save and retrive data from the products table in the database
const userModel = require("../models/user");
const expenseModel = require("../models/expense");
const orderModel = require("../models/order");
const urlModel = require("../models/url");
const bcrypt = require("bcrypt");

/*************************************************************/
//  Fetching Data of Already Available Users
/*************************************************************/
exports.gethomePage = (request, response, next) => {
  response.sendFile("sign-up.html", { root: "client/public/views" });
};

/*************************************************************/
//  Fetching Data of Already Available Users
/*************************************************************/
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll({
      attributes: ["email", "phoneNumber"],
    });

    res.status(200).json({ allUsers: users });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/*************************************************************/
//  Adding New User
/*************************************************************/
exports.postAddUser = async (req, res, next) => {
  try {
    const uname = req.body.username;
    const uemail = req.body.email;
    const uphonenumber = req.body.mobile;
    const upassword = req.body.password;

    bcrypt.hash(upassword, 10, async (err, hash) => {
      const data = await userModel.create({
        name: uname,
        email: uemail,
        phoneNumber: uphonenumber,
        password: hash,
      });

      res.status(201).json({ newUserDetail: data });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/*************************************************************/
//  Deleting User
/*************************************************************/
exports.postDeleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await userModel.destroy({ where: { id: userId } });
    await urlModel.destroy({ where: { userId: userId } });
    await expenseModel.destroy({ where: { userId: userId } });
    await orderModel.destroy({ where: { userId: userId } });

    res.status(200).json({ message: "User Deleted succesfully!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
