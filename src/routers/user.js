const express = require("express");
const router = new express.Router();
const { auth } = require("../middleware/authMiddleware")
const { registerUser, loginUser, allUsers } = require("../controller/user");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.route("/user").get(auth, allUsers);
    
module.exports = router;
