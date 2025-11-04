const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/User", userController.createUser);
router.get("/User", userController.getAlluser);
// router.get("/UserByAdminId/:id", userController.getUserByAdminId);
router.get("/User/:id", userController.getuserById);
router.put("/User/:id", userController.updateuser);
router.delete("/User/:id", userController.deleteUser);
// router.get("/export-userData", userController.exporUserCSV)
router.put("/User/:id/change-password", userController.changePassword);
module.exports = router;
