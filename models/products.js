const mongoose = require("mongoose")
const { Schema, model } = mongoose

const Item = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: Array },
        tags: { type: Array },
        description: { type: String },
        quantity: { type: Number, default: 0 },
        brand: { type: String },
    },
    { collection: "products" }
)

const ItemModel = model("Item", Item)

module.exports = ItemModel
