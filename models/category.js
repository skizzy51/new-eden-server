const mongoose = require("mongoose")
const { Schema, model } = mongoose

const Category = new Schema(
    {
        name: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    },
    { collection: "category" }
)

const CategoryModel = model("Category", Category)

module.exports = CategoryModel
