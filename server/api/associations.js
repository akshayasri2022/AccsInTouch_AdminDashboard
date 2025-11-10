const CustomerCreation = require("./model/customerModel");
const OrderCreation = require("./model/orderCreation");
const ProductCreation = require("./model/productCreation");

const defineAssociations = () => {
  CustomerCreation.hasMany(OrderCreation, {
    foreignKey: "custID",
    as: "customerOrder",
    onDelete: "CASCADE", // ✅ Delete orders when product is deleted
    hooks: true,
  });
  OrderCreation.belongsTo(CustomerCreation, {
    foreignKey: "custID",
    as: "orderCustomer",
    onDelete: "CASCADE",
  });
  ProductCreation.hasMany(OrderCreation, {
    foreignKey: "prodID",
    as: "productOrder",
    onDelete: "CASCADE", // ✅ Delete orders when product is deleted
    hooks: true,
  });
  OrderCreation.belongsTo(ProductCreation, {
    foreignKey: "prodID",
    as: "OrderedProduct",
    onDelete: "CASCADE",
  });
};
module.exports = defineAssociations;
