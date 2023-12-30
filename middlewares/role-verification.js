function VerifyRoles(...roles) {
    const CheckRole = (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "User not logged in" })
            return
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "User not allowed" })
            return
        }
        next()
    }
    return CheckRole
}

module.exports = VerifyRoles
