const Transaction = require("../models/transaction")

function Success(res, message, data = {}) {
    res.status(200).json({ message, data })
}

function Failure(res, code, message, data = {}) {
    res.status(code).json({ message, data })
}

function Created(res, data = {}) {
    res.status(201).json({ message: "Successfully created", data })
}

async function CreateTransaction(req, res, next) {
    try {
        const { _id } = req.user
        const { items, amount } = req.body
        const transaction = new Transaction({ items, amount, user: _id })
        await transaction.save()
        if (transaction) Success(res, "Order placed", transaction)
        else Failure(res, 500, "Error placing order", transaction)
    } catch (error) {
        next(error)
    }
}

async function UpdateTransactionStatus(req, res, next) {
    try {
        const { status, transactionId } = req.body
        const updateItem = {
            status,
        }
        const update = await Transaction.updateOne(
            { _id: transactionId },
            updateItem
        )
        update.modifiedCount > 0
            ? Success(res, "Order updated", update)
            : Failure(res, 400, "Failed to update order")
    } catch (error) {
        next(error)
    }
}

async function GetAllTransactions(req, res, next) {
    try {
        const transactions = await Transaction.find({})
        transactions.length > 0
            ? Success(res, "Transactions", transactions)
            : Failure(res, 404, "No transactions found", transactions)
    } catch (error) {
        next(error)
    }
}

async function GetUserTransactions(req, res, next) {
    try {
        const { _id } = req.user
        const transactions = await Transaction.find({ user: _id })
        transactions.length > 0
            ? Success(res, "Transactions", transactions)
            : Failure(res, 404, "No transactions found", transactions)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateTransaction,
    UpdateTransactionStatus,
    GetAllTransactions,
    GetUserTransactions,
}
