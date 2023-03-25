const mongoose = require('mongoose');
require("dotenv").config();
const mongoURI = process.env.DB_CONNECT;
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("connected to DB");
        }
    }
)