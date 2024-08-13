const express = require("express")
const { json } = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const router = require("../routes")
const cors = require("cors")

const app = express()
dotenv.config()

const VerifyToken = require("../middlewares/token-verification")
const {
    CreateProduct,
    DeleteProduct,
    GetAllProducts,
    GetProduct,
    UpdateProduct,
} = require("../controllers/ProductController")
const {
    CreateCategory,
    GetAllCategories,
    DeleteCategory,
    GetCategory,
} = require("../controllers/CategoryContoller")
const {
    LoginUser,
    CreateUser,
    GetUser,
    DeleteUser,
    ChangeUsername,
    ChangePassword,
    MarkFavorite,
    UnmarkFavorite,
} = require("../controllers/UserController")
const {
    CreateTransaction,
    UpdateTransactionStatus,
    GetAllTransactions,
    GetUserTransactions,
} = require("../controllers/TransactionController")
const VerifyRoles = require("../middlewares/role-verification")

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
            "https://eden-next-app.vercel.app",
        ],
    })
)
app.use(json({ limit: "5mb" }))
// app.use("/shop", router)
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Eden Supermarket APIs",
        data: ["No data"],
    })
})

app.post("/item", CreateProduct)
app.get("/item", GetAllProducts)
app.delete("/item-delete/:id", DeleteProduct)
app.get("/item-get/:id", GetProduct)
app.post("/item-update", UpdateProduct)
app.post("/category", CreateCategory)
app.get("/category", GetAllCategories)
app.delete("/category-delete/:id", DeleteCategory)
app.get("/category-get/:id", GetCategory)
app.post("/login", LoginUser)
app.post("/register", CreateUser)
app.get("/user", VerifyToken, GetUser)
app.delete("/user", DeleteUser)
app.post("/user/username", ChangeUsername)
app.post("/user/password", ChangePassword)
app.post("/favorite", VerifyToken, MarkFavorite)
app.post("/unfavorite", VerifyToken, UnmarkFavorite)
app.post("/transaction", VerifyToken, CreateTransaction)
app.patch(
    "/transaction",
    VerifyToken,
    VerifyRoles("admin"),
    UpdateTransactionStatus
)
app.get(VerifyToken, VerifyRoles("admin"), GetAllTransactions)
app.get("/transaction/user", VerifyToken, GetUserTransactions)
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
module.exports = app
