const mongoose = require("mongoose")
const { Schema, model } = mongoose

const User = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        favorites: [{ type: Schema.Types.ObjectId, ref: "Item" }],
        role: { type: String, default: "user" },
    },
    { collection: "user" }
)

const UserModel = model("User", User)

module.exports = UserModel
