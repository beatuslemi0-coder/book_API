
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require('dotenv').config();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "book_cover",
        allowed_formats:["jpg","jpeg","png","webp"],
    },
});
const fileFilter = (req, file, cb) => {
    console.log(file.originalname);
    console.log(file.mimetype);

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/octet-stream",
    ];
    if (allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error("only JPG, JPEG and PNG files are allowed"));
    }
};
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 5 * 1024 *1024 
    }
});
module.exports = upload;