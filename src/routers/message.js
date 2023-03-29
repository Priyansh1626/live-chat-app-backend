const express = require("express");
const router = new express.Router();
const { sendMessage, allMessages } = require("../controller/message");
const { auth } = require("../middleware/authMiddleware")

router.route('/').post(auth,sendMessage)
router.route('/:chatId').get(auth, allMessages)

module.exports = router;
