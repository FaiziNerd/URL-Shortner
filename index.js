const express = require("express");
const app = express();
const path = require("path")
const cookieParser = require('cookie-parser')

require("dotenv").config();

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user")
const staticRoute = require('./routes/staticRouter')


const connectToMongoDB = require("./connect");
const URL = require("./models/url")

const PORT = process.env.PORT;

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


// Connect MongoDB
connectToMongoDB()
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
// view engine
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))


// Routes
app.use("/url", urlRoute);
app.use('/', staticRoute)
app.use('/user', userRoute)

app.get('/url/:shortId', async (req,res)=>
{
 const shortId = req.params.shortId
 const  entry = await URL.findOneAndUpdate(
    {
        shortId,
    },{$push:{
        visitHistory:{
            timestamp: Date.now(),
        },
    }})
    res.redirect(entry.redirectURL)
})

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});