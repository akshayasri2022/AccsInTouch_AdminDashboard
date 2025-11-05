const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CustomerSignUp = sequelize.define(
  "Customers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
        phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // gender: {
    //   type: DataTypes.ENUM("Male", "Female", "Others"),
    //   allowNull: true,
    // },
    BuildingNo_Streetaddr:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stateName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BillingAddress:{
      type: DataTypes.STRING,
      allowNull: true,
    },
        customerID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["customerEmail"],
      },
    ],
  }
);

module.exports = CustomerSignUp;
