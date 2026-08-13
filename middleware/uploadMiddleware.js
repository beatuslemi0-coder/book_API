
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require('dotenv').config();

cloudinary.config({
    cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECTET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "book_cover",
        allowed_formats:["jpg","jpeg","png","webp"],
        transformation:[{width:500, height:700,crop: 'limit'}],
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
module.exports = {cloudinary,upload};