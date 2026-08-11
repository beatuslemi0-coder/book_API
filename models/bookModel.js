const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required: [true, "title is required"]
    },
    author: {
        type:String,
        required: [true, "title is required"]
    },
    price: {
        type: Number,
        required:true
    },
    publishedYear:{
        type:Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default:""
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Book", bookSchema);
