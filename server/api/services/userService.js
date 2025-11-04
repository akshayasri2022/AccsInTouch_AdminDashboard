
const UserSignUp = require("../model/userModel");
const uploadFile = require("../../fileUpload/fileupload");
const bcrypt = require("bcryptjs");
const Allowed_type = require("../../fileUpload/allow_type");

const uploadFiles = async (files) => {
  const uploadPromises = files.map((file) => uploadFile(file, Allowed_type));
  try {
    const results = await Promise.all(uploadPromises);
    // FIX: Directly return the URL string
   const uploadedData = {
 image_url: results[0]?.success ? { url: results[0].url } : null, 
}; // <-- Now it returns the string (e.g., '/path/to/image.jpg')
    return uploadedData;
  } catch (error) {
    throw error;
  }
};

const createUser = async (data, files) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }
  try {
    const existingUser = await UserSignUp.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User Email Already Registered");
    }

    // If file is uploaded
if (files && files.image_url && files.image_url.length > 0) { // **CHANGED `profile` to `image_url`**
  const uploadData = await uploadFiles([files.image_url[0]]);
  data.image_url = uploadData.image_url; // This assigns the returned URL
}


    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;
    }

    const newUser = await UserSignUp.create(data);
    return newUser;
  } catch (error) {
    throw error;
  }
};

// module.exports = { createUser };

const getAllUsers = async () => {
  try {
    const getAllUser = await UserSignUp.findAll();
    return getAllUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const userId = await UserSignUp.findByPk(id);
    return userId;
  } catch (error) {
    throw new Error("Error retrieving user by id");
  }
};

const getUserByAdminId = async (adminId) => {
  try {
    const users = await UserSignUp.findAll({
      where: { adminID: adminId },
      include: [
        {
          model: UserSignUp,
          as: "teamLead", // Optional: show admin details for each member
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    return users;
  } catch (error) {
    console.error("Error in getUserByAdminId:", error.message);
    throw new Error("Error retrieving users by AdminId");
  }
};

const updateUser = async (id, data, files) => {
  try {
    const existingUser = await UserSignUp.findOne({ where: { id } });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Upload image if present
  if(files && files.image_url && files.image_url.length > 0) { // **CHANGED `profile` to `image_url`**
  const uploadData = await uploadFiles([files.image_url[0]]);
  data.image_url = uploadData.image_url;
}

    // Handle password update
    if (data.oldPassword && data.password) {
      const isMatch = await bcrypt.compare(data.oldPassword, existingUser.password);
      if (!isMatch) {
        throw new Error("Old password does not match");
      }
      if (data.oldPassword === data.password) {
        throw new Error("New password can't be the same as old password");
      }

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else if (data.password && !data.oldPassword) {
      // Optional: Only hash if it's a fresh password update (no validation)
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Perform update
    const [updatedCount] = await UserSignUp.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      throw new Error("No fields were changed or user not found.");
    }

    // Return updated user
    const updatedUser = await UserSignUp.findByPk(id);
    return updatedUser;
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const deleteUser = await UserSignUp.destroy({
      where: { id: id },
    });
    return deleteUser;
  } catch (error) {
    throw error;
  }
};

const exportUserData = async (role = null) => {
  try {
     const whereClause = role ? { role } : {};
    const users = await UserSignUp.findAll({ where: whereClause });
    return users;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createUser,
  getAllUsers,
  getUserByAdminId,
  getUserById,
  updateUser,
  deleteUser,
  exportUserData,
};