const Category = require("../models/category")

function Success(res, message, data = {}) {
    res.status(200).json({ message, data })
}

function Failure(res, code, message, data = {}) {
    res.status(code).json({ message, data })
}

function Created(res, data = {}) {
    res.status(201).json({ message: "Successfully created", data })
}

async function CreateCategory(req, res, next) {
    try {
        const { name, products } = req.body
        const category = new Category({ name, products })
        await category.save()
        if (category) Created(res, category)
        else Failure(res, 500, "Error creating category", category)
    } catch (error) {
        next(error)
    }
}

async function GetAllCategories(req, res, next) {
    try {
        const categories = await Category.find({}).populate("products")
        categories.length > 0
            ? Success(res, "All categories", categories)
            : Failure(res, 404, "Categories not found", categories)
    } catch (error) {
        next(error)
    }
}

async function GetCategory(req, res, next) {
    try {
        const { id } = req.params
        const category = await Category.findById(id).populate("products")
        category
            ? Success(res, "Category found", category)
            : Failure(res, 404, "Category not found", category)
    } catch (error) {
        next(error)
    }
}

async function DeleteCategory(req, res, next) {
    try {
        const { id } = req.params
        const category = await Category.findOneAndDelete({ _id: id })
        if (category) {
            Success(res, "Category deleted", category)
        } else {
            Failure(res, 501, "Category not deleted", category)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateCategory,
    GetAllCategories,
    GetCategory,
    DeleteCategory,
}
