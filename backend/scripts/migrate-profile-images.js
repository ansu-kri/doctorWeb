require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../src/Model/user");
const Doctor = require("../src/Model/DoctorSchema");
const { uploadToCloudinary, deleteFromCloudinary } = require("../src/Configs/cloudinary");

const backendRoot = path.resolve(__dirname, "..");
const uploadRoot = path.resolve(backendRoot, "uploads");
const applyChanges = process.argv.includes("--apply");
const imageModels = [
  { model: User, imageField: "profilePic", publicIdField: "profilePicPublicId" },
  { model: Doctor, imageField: "photo", publicIdField: "photoPublicId" },
];

const legacyImageQuery = (imageField, publicIdField) => ({
  [imageField]: { $regex: "^/?uploads/" },
  $or: [
    { [publicIdField]: { $exists: false } },
    { [publicIdField]: null },
    { [publicIdField]: "" },
  ],
});

const resolveLegacyFile = (storedPath) => {
  const normalized = String(storedPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const segments = normalized.split("/");
  if (segments[0] !== "uploads" || segments.length < 2) return null;
  const filePath = path.resolve(uploadRoot, ...segments.slice(1));
  if (!filePath.startsWith(`${uploadRoot}${path.sep}`)) return null;
  return filePath;
};

const migrate = async () => {
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required.");
  await mongoose.connect(process.env.MONGO_URL);
  const targets = [];
  let migrated = 0;
  let missing = 0;
  let conflicts = 0;

  for (const imageModel of imageModels) {
    const candidates = await imageModel.model
      .find(legacyImageQuery(imageModel.imageField, imageModel.publicIdField))
      .select(`_id ${imageModel.imageField} ${imageModel.publicIdField}`)
      .lean();
    targets.push(...candidates.map((candidate) => ({ ...imageModel, candidate })));
  }

  if (!applyChanges) {
    for (const { candidate, imageField } of targets) {
      const filePath = resolveLegacyFile(candidate[imageField]);
      if (!filePath || !fs.existsSync(filePath)) missing += 1;
    }
    console.log(
      `Dry run: ${targets.length} legacy image reference(s), ${missing} missing or unsafe local file(s). No data or files changed.`
    );
    console.log("Review the counts, then rerun with --apply to migrate eligible references. Local files are retained.");
    return;
  }

  for (const { model, imageField, publicIdField, candidate } of targets) {
    const currentImage = candidate[imageField];
    const filePath = resolveLegacyFile(currentImage);
    if (!filePath || !fs.existsSync(filePath)) {
      missing += 1;
      continue;
    }

    const asset = await uploadToCloudinary(fs.readFileSync(filePath));
    let result;
    try {
      result = await model.updateOne(
        {
          _id: candidate._id,
          [imageField]: currentImage,
          $or: [
            { [publicIdField]: { $exists: false } },
            { [publicIdField]: null },
            { [publicIdField]: "" },
          ],
        },
        {
          $set: {
            [imageField]: asset.secure_url,
            [publicIdField]: asset.public_id,
          },
        }
      );
    } catch (error) {
      try {
        await deleteFromCloudinary(asset.public_id);
      } catch (cleanupError) {
        console.error("Could not clean up an unreferenced migration upload:", cleanupError.message);
      }
      throw error;
    }

    if (!result.matchedCount) {
      await deleteFromCloudinary(asset.public_id);
      conflicts += 1;
      continue;
    }
    migrated += 1;
  }

  console.log(
    `Migration finished: ${migrated} migrated, ${missing} missing or unsafe local file(s), ${conflicts} changed concurrently. Local files were retained.`
  );
};

migrate()
  .catch((error) => {
    console.error("Profile image migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect();
  });
