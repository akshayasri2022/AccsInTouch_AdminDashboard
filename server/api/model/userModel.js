const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const UserSignUp = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Others"),
      allowNull: true,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    districtName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stateName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "employee"),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

module.exports = UserSignUp;
