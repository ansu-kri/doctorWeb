const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfiguration = () => {
  if (
    !process.env.CLOUDINARY_API_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary is not configured on the backend.");
  }
};

const uploadToCloudinary = async (fileBuffer, options = {}) => {
  ensureCloudinaryConfiguration();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "medicare/profiles",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url || !result.public_id) {
          return reject(new Error("Cloudinary returned incomplete image metadata."));
        }
        return resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return { result: "not found" };
  ensureCloudinaryConfiguration();
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  ensureCloudinaryConfiguration,
};