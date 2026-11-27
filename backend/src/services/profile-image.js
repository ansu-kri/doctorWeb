const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../Configs/cloudinary");

const setProfileImage = async (
  user,
  file,
  { upload = uploadToCloudinary, destroy = deleteFromCloudinary } = {}
) => {
  const uploaded = await upload(file.buffer);
  if (!uploaded?.secure_url || !uploaded.public_id) {
    throw new Error("Cloudinary returned incomplete image metadata.");
  }
  const previousPublicId = user.profilePicPublicId;
  user.profilePic = uploaded.secure_url;
  user.profilePicPublicId = uploaded.public_id;

  try {
    await user.save();
  } catch (error) {
    try {
      await destroy(uploaded.public_id);
    } catch (cleanupError) {
      console.error("Could not clean up an unreferenced profile image:", cleanupError.message);
    }
    throw error;
  }

  if (previousPublicId && previousPublicId !== uploaded.public_id) {
    try {
      await destroy(previousPublicId);
    } catch (error) {
      console.error("Could not clean up a replaced profile image:", error.message);
      return "Profile updated, but the previous image could not be removed from Cloudinary.";
    }
  }
  return null;
};

const removeProfileImage = async (
  user,
  { destroy = deleteFromCloudinary } = {}
) => {
  const previousPublicId = user.profilePicPublicId;
  user.profilePic = "";
  user.profilePicPublicId = "";
  await user.save();

  if (!previousPublicId) return null;
  try {
    await destroy(previousPublicId);
  } catch (error) {
    console.error("Could not clean up a removed profile image:", error.message);
    return "Profile image was removed, but its Cloudinary file could not be deleted.";
  }
  return null;
};

module.exports = { setProfileImage, removeProfileImage };
