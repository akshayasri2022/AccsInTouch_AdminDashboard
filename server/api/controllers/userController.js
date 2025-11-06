const parseRequestFiles = require("../../fileUpload/requestedfile");
const userSignUpService = require("../services/userService");
const fastcsv = require("fast-csv");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const { format } = require("date-fns");
const createUser = async (req, res) => {
  try {
    console.log("⏳ Incoming request to create user");
    const payload = await parseRequestFiles(req);
    console.log("✅ Parsed Payload:", payload);
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0];
    }
    const newUser = await userSignUpService.createUser(req.body, payload.files);
    return res.status(201).json({
      message: "User Created Successfully",
      newUser,
    });
  } catch (error) {
    console.error("❌ Error in createUser:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      stack: error.stack,
    });
  }
};

const getAlluser = async (req, res) => {
  try {
    const getAllUser = await userSignUpService.getAllUsers();
    res.status(200).json(getAllUser);
  } catch (error) {
    console.log("Error fetching users", error);
    return res.status(500).json({ error: error.message });
  }
};

const getuserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userSignUpService.getUserById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found by this id" });
    }
  } catch (error) {
    console.log("Error fetching user by id");
    return res.status(500).json({ error: error.message });
  }
};


const updateuser = async (req, res) => {
  try {
    const userId = req.params.id;
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

    const updatedUser = await userSignUpService.updateUser(
      userId,
      req.body,
      req.files
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUserId = await userSignUpService.deleteUser(userId);
    if (deleteUserId) {
      res.status(204).json(deleteUserId);
    } else {
      res.status(404).json({ message: "user id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find user by primary key
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const exporUserCSV = async (req, res) => {
//   try {
//     const role = req.query.role || null;
//     const users = await userSignUpService.exportUserData(role);

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=user_data_${format(new Date(), "yyyyMMdd")}.csv`
//     );

//     const csvStream = fastcsv.format({ headers: true });
//     csvStream.pipe(res);
//     // let sn = 1;
//     users.forEach((user) => {
//       csvStream.write({
//         // id: user.id,
//         // sn: sn++,
//         userID: user.userID,
//         plotID: user.plotID,
//         fullName: user.fullName,
//         organizationname: user.organizationname,
//         organizationtype: user.organizationtype,
//         phoneNumber: user.phoneNumber,
//         email: user.email,
//         password: user.password,
//         gender: user.gender,
//         dateOfBirth: user.dateOfBirth,
//         registeredNumber: user.registeredNumber,
//         primaryNumber: user.primaryNumber,
//         alternativeNumber: user.alternativeNumber,
//         industry: user.industry,
//         designation: user.designation,
//         websiteURL: user.websiteURL,
//         offAddresss: user.offAddresss,
//         municipalZone: user.municipalZone,
//         cityName: user.cityName,
//         lattitude: user.lattitude,
//         longitude: user.longitude,
//         districtName: user.districtName,
//         stateName: user.stateName,
//         pinCode: user.pinCode,
//         projectName: user.projectName,
//         projectId: user.projectId,
//         projectStartDate: user.projectStartDate,
//         projectDuration: user.projectDuration,
//         userID: user.userID,
//         paymentStatus: user.paymentStatus,
//         DashboardAssecss: user.DashboardAssecss,
//         role: user.role,
//         image_url: user.image_url,
//         adminID: user.adminID,
//       });
//     });
//     csvStream.end();
//   } catch (error) {
//     if (!res.headersSent) {
//       return res.status(500).json({ error: error.message });
//     } else {
//       console.error("Error after response sent:", error);
//     }
//   }
// };

module.exports = {
  createUser,
  getAlluser,
  getuserById,
  // getUserByAdminId,
  updateuser,
  deleteUser,
  // exporUserCSV,
  changePassword,
};
