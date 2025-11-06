const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

router.post("/Product", ProductController.createProduct);
router.get("/Product", ProductController.getAllProduct);
router.get("/Product/:id", ProductController.getProductById);
router.put("/Product/:id", ProductController.updateProduct);
router.delete("/Product/:id", ProductController.deleteProduct);
module.exports = router;
