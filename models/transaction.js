const mongoose = require("mongoose")
const { Schema, model } = mongoose

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
})

const Transaction = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["awaiting", "delivered"],
            default: "awaiting",
        },
        amount: { type: Number },
        items: [itemSchema],
    },
    { timestamps: true },
    { collection: "transactions" }
)

const TransactionModel = model("Transaction", Transaction)

module.exports = TransactionModel
