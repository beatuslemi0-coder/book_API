const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = async (req,res) => {
    try{
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await User.create({
        name,
        email,
        password:hashedPassword
    });
    res.status(201).json({
        success:true,
        message: "User registered succefully",
        user
    });
} catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    });
}

};
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success:false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET  || "yoursecretkey",
            { expiresIn: "7d"}
        );
        res.status(200).json({
            success:true,
            message: "Login successfuly",
            token,
            user: {
                id: user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message:error.message
        });
    }
};
module.exports = {
    registerUser,
    loginUser
};