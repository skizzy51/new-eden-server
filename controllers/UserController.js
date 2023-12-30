const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function Success(res, message, data = {}) {
    res.status(200).json({ message, data })
}

function Failure(res, code, message, data = {}) {
    res.status(code).json({ message, data })
}

function Created(res, data = {}) {
    res.status(201).json({ message: "Successfully created", data })
}

async function CreateUser(req, res, next) {
    try {
        const { username, password } = req.body
        const userExist = await User.findOne({ username })
        if (userExist) {
            return Failure(res, 409, "User already exists", {})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, password: hashedPassword })
        await user.save()
        if (!user) {
            Failure(res, 424, "Error creating user")
            return
        }
        const token = jwt.sign({ id: user._id }, process.env.CIPHER, {
            expiresIn: "1h",
        })
        Created(res, { token, user })
    } catch (error) {
        next(error)
    }
}

async function LoginUser(req, res, next) {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username }).populate("favorites")
        if (!user) {
            Failure(res, 400, "User does not exist")
            return
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.CIPHER, {
                expiresIn: "1h",
            })
            Success(res, "Logged In", { token, user })
        } else {
            Failure(res, 400, "Invalid password")
            return
        }
    } catch (error) {
        next(error)
    }
}

async function ChangeUsername(req, res, next) {
    try {
        const { _id } = req.user
        const newUsername = req.body.username
        const allUsers = await User.where("username").equals(newUsername)
        if (allUsers.length > 0) {
            return Failure(res, 400, "Username already exists")
        }
        const update = await User.updateOne({ _id }, { username: newUsername })

        if (update.modifiedCount > 0) {
            Success(res, "Username updated")
        } else {
            Failure(res, 304, "Error updating username")
        }
    } catch (error) {
        next(error)
    }
}

async function ChangePassword(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body
        const user = req.user
        if (await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const update = await User.updateOne(
                { _id: user._id },
                { password: hashedPassword }
            )
            if (update.modifiedCount > 0) {
                Success(res, "Password updated")
            } else {
                Failure(res, 304, "Error updating password")
            }
        } else {
            res.json({ message: "Incorrect old password" })
        }
    } catch (error) {
        next(error)
    }
}

async function GetUser(req, res, next) {
    try {
        const { _id } = req.user
        const user = await User.findById(_id).populate("favorites")
        res.json({ message: "User found", user: user })
    } catch (error) {
        next(error)
    }
}

async function DeleteUser(req, res, next) {
    try {
        const { _id } = req.user
        const deletedUser = await User.findOneAndDelete({ _id })
        deletedUser
            ? Success(res, "User deleted", deletedUser)
            : Failure(res, 400, "Error deleting user")
    } catch (error) {
        next(error)
    }
}

async function MarkFavorite(req, res, next) {
    try {
        const { _id } = req.user
        const { id } = req.body
        const check = await User.find({
            _id,
            favorites: { $all: id },
        })
        if (check.length > 0) {
            return res
                .status(400)
                .json({ message: "Already part of favorites" })
        }
        const userUpdate = await User.updateOne(
            { _id },
            { $push: { favorites: id } }
        )

        userUpdate.modifiedCount > 0
            ? Success(res, "Marked as favorite", id)
            : Failure(res, 400, "Error adding to favorites")
    } catch (error) {
        next(error)
    }
}

async function UnmarkFavorite(req, res, next) {
    try {
        const { _id } = req.user
        const { id } = req.body
        const check = await User.find({
            _id,
            favorites: { $all: id },
        })
        if (check.length < 0) {
            return res
                .status(400)
                .json({ message: "Product not part of favorites" })
        }
        const userUpdate = await User.updateOne(
            { _id },
            { $pull: { favorites: id } }
        )

        userUpdate.modifiedCount > 0
            ? Success(res, "Unmarked as favorite", id)
            : Failure(res, 400, "Error removing from favorites")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateUser,
    LoginUser,
    ChangeUsername,
    ChangePassword,
    GetUser,
    DeleteUser,
    MarkFavorite,
    UnmarkFavorite,
}
