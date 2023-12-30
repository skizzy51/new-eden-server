const jwt = require("jsonwebtoken")
const User = require("../models/user")

const VerifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorised request" })
        return
    }
    const [prefix, token] = authHeader.split(" ")
    if (prefix !== "Bearer") {
        res.status(403).json({ message: "Unauthorised access" })
        return
    }
    try {
        const { id } = jwt.verify(token, process.env.CIPHER)
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid access" })
        return
    }
}

module.exports = VerifyToken
