const express = require("express");
const app = express();
const path = require("path")

require("dotenv").config();

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user")


const connectToMongoDB = require("./connect");
const URL = require("./models/url")

const PORT = process.env.PORT;

// Parse JSON body
app.use(express.json());

// Connect MongoDB
connectToMongoDB()
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
// view engine
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.get("/test", async (req,res)=>
{
 const allURLs = await URL.find({})
return res.render("home", {
    urls: allURLs,
})
})


// Routes
app.use("/url", urlRoute);

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