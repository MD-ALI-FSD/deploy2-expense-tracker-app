//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

//Creating product modal(modal of the object)
const ForgotPass = sequelize.define("forgotpasswords", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
  isActive: Sequelize.BOOLEAN,
});

module.exports = ForgotPass;
