const express = require("express")
const { json } = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const router = require("./routes")
const cors = require("cors")

const app = express()
dotenv.config()

async function connectDb() {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jji7d.mongodb.net/Eden-shopping-app?retryWrites=true&w=majority`
        )
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

connectDb()

app.use(
    cors({
        credentials: true,
        optionsSuccessStatus: 200,
        methods: "GET,POST,PUT,DELETE,PATCH",
        allowedHeaders: "Content-Type, Authorization",
        origin: [
            "http://localhost:2323",
            "https://eden-supermarket.vercel.app",
        ],
    })
)
app.use(json({ limit: "5mb" }))
app.use("/shop", router)
app.use("*", (req, res) => {
    res.status(400).json({
        message: "Url not found",
        error: "endpoint does not exist",
    })
})
app.use(function (err, req, res, next) {
    console.log(err)
    res.status(500).json({ success: false, message: "Internal Server Error" })
})
app.listen(process.env.PORT || 2003, () =>
    console.log("Server running on 2003")
)
