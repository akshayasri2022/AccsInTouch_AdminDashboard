const CustomerCreation = require("./model/customerModel");
const OrderCreation = require("./model/orderCreation");
const ProductCreation = require("./model/productCreation");

const defineAssociations = () => {
  CustomerCreation.hasMany(OrderCreation, {
    foreignKey: "custID",
    as: "customerOrder",
  });
  OrderCreation.belongsTo(CustomerCreation, {
    foreignKey: "custID",
    as: "orderCustomer",
  });
  ProductCreation.hasMany(OrderCreation, {
    foreignKey: "prodID",
    as: "productOrder",
  });
  OrderCreation.belongsTo(ProductCreation, {
    foreignKey: "prodID",
    as: "OrderedProduct",
  });
};
module.exports = defineAssociations;
