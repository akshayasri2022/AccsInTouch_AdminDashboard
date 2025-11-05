const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../../config/database");

const OrderCreation = sequelize.define("Orders", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  custID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prodID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // ✅ Auto-generated Order ID (ORD-001, ORD-002, etc.)
  orderID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // ✅ Payment Type ENUM
  paymentType: {
    type: DataTypes.ENUM(
      "Cash on Delivery",
      "UPI",
      "Credit Card",
      "Debit Card",
      "Net Banking"
    ),
    allowNull: false,
  },

  // ✅ Order Type ENUM
  orderType: {
    type: DataTypes.ENUM(
      "Marketplace Order",
      "Website Order",
      "In-Store Purchase"
    ),
    allowNull: false,
  },

  // ✅ Order Status ENUM
  orderStatus: {
    type: DataTypes.ENUM(
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Completed"
    ),
    allowNull: false,
    defaultValue: "Pending",
  },

  orderDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  orderTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = OrderCreation;
