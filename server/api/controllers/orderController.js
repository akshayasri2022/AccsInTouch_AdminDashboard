const parseRequestFiles = require("../../fileUpload/requestedfile");
const OrderSignUpService = require("../services/orderService");
const fastcsv = require("fast-csv");
const bcrypt = require("bcryptjs");
const { format } = require("date-fns");
const createOrder = async (req, res) => {
  try {
    console.log("⏳ Incoming request to create Order");
    const payload = await parseRequestFiles(req);
    console.log("✅ Parsed Payload:", payload);
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    const newOrder = await OrderSignUpService.createOrder(req.body);
    return res.status(201).json({
      message: "Order Created Successfully",
      newOrder,
    });
  } catch (error) {
    console.error("❌ Error in createOrder:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      stack: error.stack,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const getAllOrder = await OrderSignUpService.getAllOrder();
    res.status(200).json(getAllOrder);
  } catch (error) {
    console.log("Error fetching Orders", error);
    return res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const OrderId = req.params.id;
    const Order = await OrderSignUpService.getOrderById(OrderId);

    if (Order) {
      res.status(200).json(Order);
    } else {
      res.status(404).json({ message: "Order not found by this id" });
    }
  } catch (error) {
    console.log("Error fetching Order by id");
    return res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const OrderId = req.params.id;
    const payload = await parseRequestFiles(req);

    // Flatten fields
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }

    req.files = payload.files;

    const updatedOrder = await OrderSignUpService.updateOrder(
      OrderId,
      req.body,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating Order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const OrderId = req.params.id;
    const deleteOrderId = await OrderSignUpService.deleteOrder(OrderId);
    if (deleteOrderId) {
      res.status(204).json(deleteOrderId);
    } else {
      res.status(404).json({ message: "Order id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
