
const OrderCreation = require("../model/orderCreation");


const createOrder = async (data) => {

  try {
    const lastOrder = await OrderCreation.findOne({
      order: [["id", "DESC"]],
    });

    let nextNumber = 1;

    if (lastOrder && lastOrder.orderID) {
      const lastNum = parseInt(lastOrder.orderID.replace("ORD-", ""), 10);
      nextNumber = lastNum + 1;
    }
    const neworderID = `ORD-${String(nextNumber).padStart(3, "0")}`;
    data.orderID = neworderID;

    // Create Order
    const newOrder = await OrderCreation.create(data);
    return newOrder;

  } catch (error) {
    throw error;
  }
};


// module.exports = { createOrder };

const getAllOrder = async () => {
  try {
    const getAllOrder = await OrderCreation.findAll();
    return getAllOrder;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const orderID = await OrderCreation.findByPk(id);
    return orderID;
  } catch (error) {
    throw new Error("Error retrieving Order by id");
  }
};


const updateOrder = async (id, data, files) => {
  try {
    const existingOrder = await OrderCreation.findOne({ where: { id } });
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Perform update
    const [updatedCount] = await OrderCreation.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      throw new Error("No fields were changed or Order not found.");
    }

    // Return updated Order
    const updatedOrder = await OrderCreation.findByPk(id);
    return updatedOrder;
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};

const deleteOrder = async (id) => {
  try {
    const deleteOrder = await OrderCreation.destroy({
      where: { id: id },
    });
    return deleteOrder;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};