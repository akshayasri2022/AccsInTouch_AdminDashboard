
const ProductCreation = require("../model/productCreation");
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

const createProduct = async (data, files) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }
  try {
    const lastProduct = await ProductCreation.findOne({
      Product: [["id", "DESC"]],
    });
    // If file is uploaded
if (files && files.image_url && files.image_url.length > 0) { // **CHANGED `profile` to `image_url`**
  const uploadData = await uploadFiles([files.image_url[0]]);
  data.image_url = uploadData.image_url; // This assigns the returned URL
}

  let nextNumber = 1;

    if (lastProduct && lastProduct.productID) {
      const lastNum = parseInt(lastProduct.productID.replace("ORD-", ""), 10);
      nextNumber = lastNum + 1;
    }
    const newProductID = `ORD-${String(nextNumber).padStart(3, "0")}`;
    data.productID = newProductID;


    const newProduct = await ProductCreation.create(data);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

// module.exports = { createProduct };

const getAllProducts = async () => {
  try {
    const getAllProduct = await ProductCreation.findAll();
    return getAllProduct;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const ProductId = await ProductCreation.findByPk(id);
    return ProductId;
  } catch (error) {
    throw new Error("Error retrieving Product by id");
  }
};

const getProductByAdminId = async (adminId) => {
  try {
    const Products = await ProductCreation.findAll({
      where: { adminID: adminId },
      include: [
        {
          model: ProductCreation,
          as: "teamLead", // Optional: show admin details for each member
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    return Products;
  } catch (error) {
    console.error("Error in getProductByAdminId:", error.message);
    throw new Error("Error retrieving Products by AdminId");
  }
};

const updateProduct = async (id, data, files) => {
  try {
    const existingProduct = await ProductCreation.findOne({ where: { id } });
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Upload image if present
  if(files && files.image_url && files.image_url.length > 0) { // **CHANGED `profile` to `image_url`**
  const uploadData = await uploadFiles([files.image_url[0]]);
  data.image_url = uploadData.image_url;
}

    // Handle password update
    if (data.oldPassword && data.password) {
      const isMatch = await bcrypt.compare(data.oldPassword, existingProduct.password);
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
    const [updatedCount] = await ProductCreation.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      throw new Error("No fields were changed or Product not found.");
    }

    // Return updated Product
    const updatedProduct = await ProductCreation.findByPk(id);
    return updatedProduct;
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const deleteProduct = await ProductCreation.destroy({
      where: { id: id },
    });
    return deleteProduct;
  } catch (error) {
    throw error;
  }
};

const exportProductData = async (role = null) => {
  try {
     const whereClause = role ? { role } : {};
    const Products = await ProductCreation.findAll({ where: whereClause });
    return Products;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductByAdminId,
  getProductById,
  updateProduct,
  deleteProduct,
  exportProductData,
};