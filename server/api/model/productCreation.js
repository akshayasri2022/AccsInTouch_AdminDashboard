const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../../config/database");

const ProductCreation = sequelize.define("Products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  productID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  productCategory: {
    type: DataTypes.ENUM("Earrings", "scrunchies", "claws", "hairBows"),
    allowNull: false,
  },
  productTags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productStatus: {
    type: DataTypes.ENUM(
      "inStock",
      "lowStack",
      "outOfStock",
      "disscontinued",
      "draft"
    ),
    allowNull: false,
    defaultValue: "draft",
  },

  basicPricing: {
    type: DataTypes.STRING,
    allowNull: true,
  },
discountType: {
  type: DataTypes.ENUM(
    "0%",
    "5%",
    "10%",
    "15%",
    "20%",
    "25%",
    "30%",
    "35%",
    "40%",
    "45%",
    "50%"
  ),
},
  productSKU: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productBarcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productQuantity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productWeight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productHeight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productLength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productWidth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = ProductCreation;
