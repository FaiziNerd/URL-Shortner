const express = require("express");
const app = express();
const path = require("path")
const cookieParser = require('cookie-parser')
require("dotenv").config();

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user")
const staticRoute = require('./routes/staticRouter')


const connectToMongoDB = require("./connect");
const PORT = process.env.PORT || 8000;

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


// Connect MongoDB
connectToMongoDB()
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server started at PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed");
        console.error(err);
        process.exit(1);
    });
// view engine
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))


// Routes
app.use("/url", urlRoute);
app.use('/', staticRoute)
app.use('/user', userRoute)