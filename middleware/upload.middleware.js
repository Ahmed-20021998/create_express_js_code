// middleware/upload.middleware.js
// memoryStorage — no disk writes, works on Vercel serverless.
// The route reads req.file.buffer and uploads it to Cloudinary.
const multer = require("multer");

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mkv"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

module.exports = upload;