const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/customer", customerController.createCustomer);
router.get("/customer", customerController.getAllCustomer);
router.get("/customer/:id", customerController.getCustomerById);
router.put("/customer/:id", customerController.updateCustomer);
router.delete("/customer/:id", customerController.deleteCustomer);
module.exports = router;
