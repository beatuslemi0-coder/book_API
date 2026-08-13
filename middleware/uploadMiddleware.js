
import multer from "multer";
import { CloudinaryStorage } from 
"multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "book-commerce",
        allowed_formats:["jpg","jpeg","png"],
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
export default upload