
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' +
        Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix +
            path.extname(file.originalname)
        );
    }
});
const fileFilter = (req, file, cb) => {
    console.log(file.originalname);
    console.log(file.mimetype);

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/octet-stream"
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