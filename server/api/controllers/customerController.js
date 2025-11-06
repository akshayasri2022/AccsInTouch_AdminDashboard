const parseRequestFiles = require("../../fileUpload/requestedfile");
const CustomerSignUpService = require("../services/customerService");
const fastcsv = require("fast-csv");
const bcrypt = require("bcryptjs");
const Customer = require("../model/customerModel");
const { format } = require("date-fns");
const createCustomer = async (req, res) => {
  try {
    console.log("⏳ Incoming request to create Customer");
    const payload = await parseRequestFiles(req);
    console.log("✅ Parsed Payload:", payload);
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    const newCustomer = await CustomerSignUpService.createCustomer(req.body);
    return res.status(201).json({
      message: "Customer Created Successfully",
      newCustomer,
    });
  } catch (error) {
    console.error("❌ Error in createCustomer:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      stack: error.stack,
    });
  }
};

const getAllCustomer = async (req, res) => {
  try {
    const getAllCustomer = await CustomerSignUpService.getAllCustomers();
    res.status(200).json(getAllCustomer);
  } catch (error) {
    console.log("Error fetching Customers", error);
    return res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const CustomerId = req.params.id;
    const Customer = await CustomerSignUpService.getCustomerById(CustomerId);

    if (Customer) {
      res.status(200).json(Customer);
    } else {
      res.status(404).json({ message: "Customer not found by this id" });
    }
  } catch (error) {
    console.log("Error fetching Customer by id");
    return res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const CustomerId = req.params.id;
    const payload = await parseRequestFiles(req);

    // Flatten fields
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }

    req.files = payload.files;

    const updatedCustomer = await CustomerSignUpService.updateCustomer(
      CustomerId,
      req.body,
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating Customer:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const CustomerId = req.params.id;
    const deleteCustomerId = await CustomerSignUpService.deleteCustomer(CustomerId);
    if (deleteCustomerId) {
      res.status(204).json(deleteCustomerId);
    } else {
      res.status(404).json({ message: "Customer id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
