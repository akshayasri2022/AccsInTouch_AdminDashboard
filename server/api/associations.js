const CustomerCreation = require("./model/customerModel");
const OrderCreation = require("./model/orderCreation");

const defineAssociations = () => {
  CustomerCreation.hasMany(OrderCreation, {
    foreignKey: "custID",
    as: "customerOrder",
  });
  OrderCreation.belongsTo(CustomerCreation, {
    foreignKey: "custID",
    as: "orderCustomer",
  });
}
module.exports = defineAssociations;