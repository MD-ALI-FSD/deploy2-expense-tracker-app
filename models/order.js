//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

//Creating product modal(modal of the object)
const Order = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
