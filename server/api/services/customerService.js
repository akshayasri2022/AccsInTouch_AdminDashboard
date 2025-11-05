
const CustomerSignUp = require("../model/customerModel");
const uploadFile = require("../../fileUpload/fileupload");
const bcrypt = require("bcryptjs");
const Allowed_type = require("../../fileUpload/allow_type");


const createCustomer = async (data) => {
  if (!data.customerEmail) {
    throw new Error("customerEmail is required");
  }

  try {
    // Check if email exists
    const existingCustomer = await CustomerSignUp.findOne({
      where: { customerEmail: data.customerEmail },
    });

    if (existingCustomer) {
      throw new Error("Customer Email Already Exists");
    }

    // ✅ Fetch last inserted customer to determine next ID
    const lastCustomer = await CustomerSignUp.findOne({
      order: [["id", "DESC"]],
    });

    let nextNumber = 1;

    if (lastCustomer && lastCustomer.customerID) {
      const lastNum = parseInt(lastCustomer.customerID.replace("CUS", ""), 10);
      nextNumber = lastNum + 1;
    }

    // ✅ Format new customer ID
    const newCustomerID = `ID-${String(nextNumber).padStart(3, "0")}`;

    // ✅ Assign generated ID
    data.customerID = newCustomerID;

    // Create customer
    const newCustomer = await CustomerSignUp.create(data);
    return newCustomer;

  } catch (error) {
    throw error;
  }
};


// module.exports = { createCustomer };

const getAllCustomers = async () => {
  try {
    const getAllCustomer = await CustomerSignUp.findAll();
    return getAllCustomer;
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (id) => {
  try {
    const CustomerId = await CustomerSignUp.findByPk(id);
    return CustomerId;
  } catch (error) {
    throw new Error("Error retrieving Customer by id");
  }
};


const updateCustomer = async (id, data, files) => {
  try {
    const existingCustomer = await CustomerSignUp.findOne({ where: { id } });
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    // Perform update
    const [updatedCount] = await CustomerSignUp.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      throw new Error("No fields were changed or Customer not found.");
    }

    // Return updated Customer
    const updatedCustomer = await CustomerSignUp.findByPk(id);
    return updatedCustomer;
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};

const deleteCustomer = async (id) => {
  try {
    const deleteCustomer = await CustomerSignUp.destroy({
      where: { id: id },
    });
    return deleteCustomer;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};