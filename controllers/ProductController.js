const Item = require("../models/products")

function Success(res, message, data = {}) {
    res.status(200).json({ message, data })
}

function Failure(res, code, message, data = {}) {
    res.status(code).json({ message, data })
}

function Created(res, data = {}) {
    res.status(201).json({ message: "Successfully created", data })
}

async function CreateProduct(req, res, next) {
    try {
        const { name, price, description, images, tags, brand } = req.body
        const item = new Item({ name, price, description, images, tags, brand })
        await item.save()
        if (item) Created(res, item)
        else Failure(res, 500, "Error creating product", item)
    } catch (error) {
        next(error)
    }
}

async function GetAllProducts(req, res, next) {
    try {
        const items = await Item.find({})
        items.length > 0
            ? Success(res, "All products", items)
            : Failure(res, 404, "Products not found", items)
    } catch (error) {
        next(error)
    }
}

async function GetProduct(req, res, next) {
    try {
        const { id } = req.params
        const item = await Item.findById(id)
        item
            ? Success(res, "Product found", item)
            : Failure(res, 404, "Product not found", item)
    } catch (error) {
        next(error)
    }
}

async function UpdateProduct(req, res, next) {
    try {
        const { product } = req.body
        const updateItem = {
            name: product.name,
            price: product.price,
            images: product.images,
            tags: product.tags,
            description: product.description,
            quantity: product.quantity,
        }
        const update = await Item.updateOne({ _id: product._id }, updateItem)
        update.modifiedCount > 0
            ? Success(res, "Product updated", update)
            : Failure(res, 400, "Update failed")
    } catch (error) {
        next(error)
    }
}

async function DeleteProduct(req, res, next) {
    try {
        const { id } = req.params
        const item = await Item.findOneAndDelete({ _id: id })
        if (item) {
            item.images.forEach((image) => {
                // cloudinary delete
            })
            Success(res, "Product deleted", item)
        } else {
            Failure(res, 501, "Product not deleted", item)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateProduct,
    GetAllProducts,
    GetProduct,
    DeleteProduct,
    UpdateProduct,
}
