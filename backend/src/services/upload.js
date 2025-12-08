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

const multer = require('multer')
const path = require('path')

// Storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder to store images
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

// Allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload
