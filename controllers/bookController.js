const Book = require("../models/bookModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "book-commerce",
                resource_type: "auto",
            },(error, result) => {
                if (error) reject(error);
                else resolve(result);
            }

        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
const createBook = async (req, res) => {
    try {
        console.log("FILE:",req.file);
        console.log("BODY:", req.body);

        if (!req.file) {
            return res.status(400).json({message:"Image required"});
        }
        const result = await uploadToCloudinary(req.file.buffer);

        const book = await Book.create({
            title: req.body.title,
            author: req.body.author,
            publishedYear: req.body.publishedYear,
            price: req.body.price,
            description: req.body.description,
            image: result.secure_url,
            imagePublicId: result.public_id,
        });
        res.status(201).json({
            success: true,
            data: book,
        });
    } catch (error) {
        console.log("Create Book Error:",error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
const getBooks = async (req,res) => {
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || "createdAt";
        const books = await Book.find()
            .populate("user", "name email")
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const totalBooks = await Book.countDocuments();
        const totalpages = Math.ceil(totalBooks / limit);
        const booksWithImage = books.map((book) => ({
            ...book._doc,
            coverImage:
            `${req.protocol}://${req.get("host")}/uploads/${book.coverImage}`
        }));
        res.status(200).json({
            success: true,
            page,
            limit,
            totalBooks,
            totalpages,
            books: booksWithImage

        });
    } catch (error){
        res.status(500).json({message:
            error.message
        });
    }

};
const getBookById = async (req, res) =>{ 
    const id = req.params.id;
    console.log(req.params.id);

    const book = await Book.findById(req.params.id)
    .populate("user", "name email");
    if(!book) {
        return res.status(500).json({
            message:"Book not found"
        });
    }
    const booksWithImage = {
        ...book._doc,
        coverImage:
        `${req.protocol}://${req.get("host")}/uploads
        /${book.coverImage}`
    };
    res.status(200).json(booksWithImage);
};
const updateBook = async (req, res) => {
    try{
        const updateData = {
            ...req.body,
        };
        if (req.file) {
            updateData.coverImage = req.file.filename;
        }
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
};
const deleteBook = async (req,res) => {
    try {
        const book = await
        Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        if (book.coverImage) {
            const imagePath = path.join(__dirname,
                "../uploads", book.coverImage
            );
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await book.deleteOne();
        res.json({
            message: "Book deleted successfully"
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};
const searchBooks = async (req, res) => {
    const title = req.query.title;
    console.log(req.query.title);

    const books = await Book.find({
        title:{
            $regex: title,
            $options:"i"
        }
    });
    res.status(200).json(books);
}
module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooks
};