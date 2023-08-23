require("dotenv").config();
require("./config/conn");
const port = process.env.PORT;
const express = require("express");
const app = express();
const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const messageRouter = require("./routers/message");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(cors({
    origin: "https://live-chat-app-frontend.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Connected to port ${port}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://live-chat-app-frontend.vercel.app",
        // origin: "http://localhost:5173",
    }
})

io.on("connection", (socket) => {
    // console.log("connection established");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`User Joined Room : ${room}`);
    })
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    })
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    })
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) {
                socket.in(user._id).emit("message recieved", newMessageRecieved)
            }
        })
    })

    socket.off("setup", (userData) => {
        console.log("User disconnected");
        socket.leave(userData._id)
    })
})