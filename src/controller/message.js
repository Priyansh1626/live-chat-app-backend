const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed in request")
        return res.status(400)
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name picture email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message).status(201);

    } catch (error) {
        res.status(400) 
        throw new Error(error.message)
    }
})

const allMessages = asyncHandler(async(req,res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name picture email").populate("chat");

        res.json(messages).status(200);
    } catch (error) {
        res.status(400) 
        throw new Error(error.message)
    }
})


module.exports = {
    sendMessage,
    allMessages
}