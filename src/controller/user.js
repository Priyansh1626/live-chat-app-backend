const asyncHandler = require('express-async-handler');
const User = require("../models/user");
const generateToken = require('../config/generateAuthToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name && !email && !password) {
        res.status(400);
        throw new Error("Plear Enter all the fileds")
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already Exists");
    }
    const user = await User.create({ name, email, password, pic });
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        }).status(201);
    } else {
        res.status(401);
        throw new Error("Failed to create User");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPasswords(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        }).status(201);
    } else {
        res.status(401);
        throw new Error("Invalid Credentials");
    }
})

const allUsers = asyncHandler(async (req, res) => {
    const key = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};
    const users = await User.find(key).find({ _id: { $ne: req.user._id } });
    res.send(users);
})

module.exports = {
    registerUser,
    loginUser,
    allUsers
}