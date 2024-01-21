//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

//Creating product modal(modal of the object)
const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  isPremiumUser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  totalExpenses: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }
});

module.exports = User;
