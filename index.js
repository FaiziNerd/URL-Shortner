const express = require("express");
const app = express();

require("dotenv").config();

const urlRoute = require("./routes/url");
const connectToMongoDB = require("./connect");
const URL = require("./models/url")

const PORT = process.env.PORT;

// Parse JSON body
app.use(express.json());

// Connect MongoDB
connectToMongoDB()
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Routes
app.use("/url", urlRoute);

app.get('/:shortId', async (req,res)=>
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