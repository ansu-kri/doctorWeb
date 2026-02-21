// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const { S3Client } = require('@aws-sdk/client-s3');
// require('dotenv').config();


// // Initialize S3 client
// const s3 = new S3Client({
//     region: 'blr1', 
//     credentials: {
//         accessKeyId: "DO007GKDQ38UNG9YU8AJ",
//         secretAccessKey: "b3AZKhzunfGEilkzWjkujfZHEd0eEzy6S3JywUuIXqU",
//     },
//     endpoint: 'https://blr1.digitaloceanspaces.com',
// });

// // Set up multer and multer-s3
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: "hrms-drive",
//         acl: 'public-read', // Set permissions
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname);
//         }
//     }),
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

module.exports = upload;
