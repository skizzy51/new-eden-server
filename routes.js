const { Router } = require("express")
const VerifyToken = require("./middlewares/token-verification")
const {
    CreateProduct,
    DeleteProduct,
    GetAllProducts,
    GetProduct,
    UpdateProduct,
} = require("./controllers/ProductController")
const {
    CreateCategory,
    GetAllCategories,
    DeleteCategory,
    GetCategory,
} = require("./controllers/CategoryContoller")
const {
    LoginUser,
    CreateUser,
    GetUser,
    DeleteUser,
    ChangeUsername,
    ChangePassword,
    MarkFavorite,
    UnmarkFavorite,
} = require("./controllers/UserController")
const {
    CreateTransaction,
    UpdateTransactionStatus,
    GetAllTransactions,
    GetUserTransactions,
} = require("./controllers/TransactionController")
const VerifyRoles = require("./middlewares/role-verification")
const router = Router()

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Eden Supermarket APIs",
        data: ["No data"],
    })
})

router.route("/item").post(CreateProduct).get(GetAllProducts)

router.route("/item-delete/:id").delete(DeleteProduct)

router.route("/item-get/:id").get(GetProduct)

router.route("/item-update").post(UpdateProduct)

router.route("/category").post(CreateCategory).get(GetAllCategories)

router.route("/category-delete/:id").delete(DeleteCategory)

router.route("/category-get/:id").get(GetCategory)

router.route("/login").post(LoginUser)

router.route("/register").post(CreateUser)

router.route("/user").get(VerifyToken, GetUser).delete(DeleteUser)

router.route("/user/username").post(ChangeUsername)

router.route("/user/password").post(ChangePassword)

router.route("/favorite").post(VerifyToken, MarkFavorite)

router.route("/unfavorite").post(VerifyToken, UnmarkFavorite)

router
    .route("/transaction")
    .post(VerifyToken, CreateTransaction)
    .patch(VerifyToken, VerifyRoles("admin"), UpdateTransactionStatus)
    .get(VerifyToken, VerifyRoles("admin"), GetAllTransactions)

router.route("/transaction/user").get(VerifyToken, GetUserTransactions)

module.exports = router
