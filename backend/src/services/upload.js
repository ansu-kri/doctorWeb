const multer = require("multer");
const path = require("path");

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const allowedTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
    fields: 20,
    parts: 21,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.get(extension) !== file.mimetype) {
      const error = new Error("Upload a JPEG, PNG, GIF, or WebP image.");
      error.statusCode = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

const detectImageType = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return null;
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))
  ) {
    return "image/gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
};

const validateImageContent = (req, _res, next) => {
  if (!req.file) return next();
  if (detectImageType(req.file.buffer) !== req.file.mimetype) {
    const error = new Error("The uploaded file is not a valid supported image.");
    error.statusCode = 400;
    return next(error);
  }
  return next();
};

module.exports = { upload, validateImageContent, detectImageType, MAX_IMAGE_SIZE_BYTES };
