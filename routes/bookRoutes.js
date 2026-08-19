const express = require("express");
const router = express.Router();

const { createBook,getBooks,getBookById,updateBook,deleteBook,searchBooks } = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create new book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *             title:
 *               type: string
 *             author:
 *               type: string
 *             price:
 *               type: number
 *             publishedYear:
 *               type: number
 *             image:
 *               type: string
 *               format: binary
 *   responses:
 *     201:
 *       description: Book created successfully
 * 
 */
router.post("/",protect,admin,upload.single("image"), createBook);

/**
 * @swagger
 * /books:
 *   get:
 *      summary: Get all books
 *      tags:
 *        - Books
 *      responses:
 *        200:
 *           description: Books retrieved successfull
 */
router.get("/",getBooks);
/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: title
 *         require: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search completed successfully
 */
router.get("/search",searchBooks);
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *       404:
 *         description: Book not found
 */
router.get("/:id",getBookById);
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *               author:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               price:
 *                 type: number
 *               Description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 * 
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put("/:id",protect,admin,upload.single("image"),updateBook);
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete("/:id",protect,admin,deleteBook);
module.exports = router;