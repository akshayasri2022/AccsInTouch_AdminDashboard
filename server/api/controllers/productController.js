const parseRequestFiles = require("../../fileUpload/requestedfile");
const ProductService = require("../services/productService");
const fastcsv = require("fast-csv");
const bcrypt = require("bcryptjs");
const { format } = require("date-fns");
const createProduct = async (req, res) => {
  try {
    console.log("⏳ Incoming request to create Product");
    const payload = await parseRequestFiles(req);
    console.log("✅ Parsed Payload:", payload);
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    const newProduct = await ProductService.createProduct(req.body, payload.files);
    return res.status(201).json({
      message: "Product Created Successfully",
      newProduct,
    });
  } catch (error) {
    console.error("❌ Error in createProduct:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      stack: error.stack,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await ProductService.getAllProducts();
    res.status(200).json(getAllProduct);
  } catch (error) {
    console.log("Error fetching Products", error);
    return res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const Product = await ProductService.getProductById(id);

    if (Product) {
      res.status(200).json(Product);
    } else {
      res.status(404).json({ message: "Product not found by this id" });
    }
  } catch (error) {
    console.log("Error fetching Product by id");
    return res.status(500).json({ error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = await parseRequestFiles(req);

    // Flatten fields
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    if (req.body.gender) {
      req.body.gender =
        req.body.gender.charAt(0).toUpperCase() +
        req.body.gender.slice(1).toLowerCase();
    }

    req.files = payload.files;

    const updatedProduct = await ProductService.updateProduct(
      id,
      req.body,
      req.files
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating Product:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteid = await ProductService.deleteProduct(id);
    if (deleteid) {
      res.status(204).json(deleteid);
    } else {
      res.status(404).json({ message: "Product id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
