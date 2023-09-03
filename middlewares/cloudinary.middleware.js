const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_KEY);
console.log("CLOUDINARY_SECRET:", process.env.CLOUDINARY_SECRET);
console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadImage(buffer) {
  try {
    console.log("Starting uploadImage");
    const base64String = buffer.toString('base64'); 
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
      folder: 'fotos-ironmeet'
    });
    console.log("Finished uploadImage");
    console.log("Upload result:", result);

    if (result && result.secure_url) {
      return result.secure_url;
    } else {
      console.error("Secure URL is not defined in the result");
      return null;
    }
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
}

module.exports = { upload, uploadImage };