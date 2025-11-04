// const fs= require("fs");
// require("dotenv").config();
// const cloudinary=require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "donr5vjjh",      
//   api_key: "197751342467181",
//   api_secret: "97syA5WYAgZ6RZNmXDKnQLr4Gp0", 
// });


// const uploadFile= async(file, allowedTypes)=>{
//     try{
//         if(!file || !file.mimetype || !allowedTypes.includes(file.mimetype)){
// console.warn("Invalid or unsupported file type:", file?.mimetype);
// return {
//     success:false, message:"Unsupported file type", url:null
//             };
//         }
//         console.log("Valid file type.Proceeding with upload...");
//         const isSvg=file.mimetype === "image/svg+xml";
//         const uploadResult=await cloudinary.uploader.upload(file.filepath, {
//             folder:"gis-application",
//             resource_type:isSvg? "image" : "auto",
//             public_id: file.orginalFilename?.split(".")[0],
//         });
//         console.log("Upload successful:", uploadResult);
//         return {success: true, url:uploadResult.secure_url};
//     }catch(error){
//         console.log("Error uploading file:", error);
//         return { success: false, message:"Upload failed", url: null};
//     }
// };
// module.exports=uploadFile;



// const AWS = require("aws-sdk");
// const fs = require("fs");
// const path = require("path");

// // AWS will automatically pick credentials from CLI config
// AWS.config.update({ region: "ap-south-1" });

// const s3 = new AWS.S3();
// const BUCKET_NAME = "mapxplorer";

// const uploadFile = async (file, allowedTypes) => {
//   try {
//     const filePath = file.filepath || file.path; // depending on form parser
//     const originalName = file.originalFilename || file.name || "upload";
//     const ext = path.extname(originalName);
//     const baseName = path.basename(originalName, ext);

//     // Check allowed types
//     if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
//       throw new Error("File type not allowed");
//     }

//     const fileStream = fs.createReadStream(filePath);

//     const params = {
//       Bucket: BUCKET_NAME,
//       Key: `gis-application/${baseName}${ext}`,
//       Body: fileStream,
//       ContentType: file.mimetype,
//       // ACL: "public-read",
//     };

//     const uploadResult = await s3.upload(params).promise();
//     return { success: true, url: uploadResult.Location };
//   } catch (error) {
//     console.error("❌ Upload error:", error);
//     return { success: false, url: null, message: error.message };
//   }
// };

// // ✅ Export the function
// module.exports = uploadFile;



const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

AWS.config.update({ region: "ap-south-1" });
const s3 = new AWS.S3();
const BUCKET_NAME = "mapxplorer";

const uploadFile = async (file, allowedTypes = []) => {
  try {
    const originalName = file.originalname || file.originalFilename || file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext);

    // Check allowed types if provided
const allowedExts = [
  ".tif", ".tiff", ".geojson", ".json", ".csv", ".zip", 
  ".jpg", ".jpeg", ".png", ".shp", ".dbf", ".shx", ".prj"
];
    if ((allowedTypes.length && !allowedTypes.includes(file.mimetype)) && !allowedExts.includes(ext)) {
      throw new Error(`File type not allowed: ${file.mimetype} / ${ext}`);
    }

    // Determine S3 Body
    let Body;
    if (file.path) {
      Body = fs.createReadStream(file.path); // diskStorage
    } else if (file.filepath) {
      Body = fs.createReadStream(file.filepath); // form parser
    } else if (file.buffer) {
      Body = file.buffer; // memoryStorage
    } else {
      throw new Error("No file path or buffer found");
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: `gis-application/${baseName}${ext}`,
      Body,
      ContentType: file.mimetype || "application/octet-stream",
      // ACL: "public-read"
    };

    const uploadResult = await s3.upload(params).promise();
    return { success: true, url: uploadResult.Location };
  } catch (error) {
    console.error("❌ Upload error:", error);
    return { success: false, url: null, message: error.message };
  }
};

module.exports = uploadFile;
