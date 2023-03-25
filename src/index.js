require("dotenv").config();
require("./config/conn");
const port = process.env.PORT;
const express = require("express");
const app = express();
const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(userRouter);
app.use("/chat", chatRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Connected to port ${port}`);
});