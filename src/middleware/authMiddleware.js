const jwt = require('jsonwebtoken');
const User = require("../models/user");
const asyncHandler = require('express-async-handler');
require("dotenv").config();

const auth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.slice(7);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not authorised, Token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorised, No Token");
    }
})

module.exports = { auth };
