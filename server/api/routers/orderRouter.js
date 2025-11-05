const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.post("/Order", OrderController.createOrder);
router.get("/Order", OrderController.getAllOrder);
router.get("/Order/:id", OrderController.getOrderById);
router.put("/Order/:id", OrderController.updateOrder);
router.delete("/Order/:id", OrderController.deleteOrder);
module.exports = router;
