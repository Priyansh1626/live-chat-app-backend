const express = require("express");
const router = new express.Router();
const { auth } = require("../middleware/authMiddleware")

const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controller/chat");

router.route("/").post(auth, accessChat).get(auth, fetchChats);
// router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
router.route("/rename").put(auth, renameGroup);
router.route("/groupadd").put(auth, addToGroup);
router.route("/groupremove").put(auth, removeFromGroup);

module.exports = router;
