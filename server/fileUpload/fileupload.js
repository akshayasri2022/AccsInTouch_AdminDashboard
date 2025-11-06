const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file, allowedTypes) => {
  console.log(file, "file to upload");
  console.log(allowedTypes, "allowed types");

  try {
    // Validate file and mimetype
    if (!file || !file.mimetype) {
      throw new Error("Invalid file or missing mimetype");
    }
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed`);
    }
    if (!file.filepath || !file.originalFilename) {
      throw new Error("Missing file path or original filename");
    }

    // Determine resource type based on mimetype
    const resourceType = ["image/jpeg", "image/png", "image/svg+xml"].includes(file.mimetype)
      ? "image"
      : "auto";

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "trosnow",
      resource_type: resourceType, // Use "image" for images, "auto" for others
      public_id: file.originalFilename.split(".")[0],
    });
    console.log(uploadResult, "uploadResult");

    // Append f_auto for image resources
    const url = resourceType === "image" ? `${uploadResult.secure_url}?f_auto` : uploadResult.secure_url;

    return { success: true, url };
  } catch (err) {
    console.error("Error uploading file to Cloudinary:", err);
    throw new Error(`File upload failed: ${err.message}`);
  } finally {
    // Clean up temporary file if it exists
    if (file?.filepath && fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }
  }
};

module.exports = uploadFile;
