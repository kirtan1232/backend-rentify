const path = require('path');
const productModel = require('../models/productModels');
const fs = require('fs');

// Create a new product
const createProduct = async (req, res) => {
    const { 
        roomDescription, 
        purpose, 
        floor, 
        status, 
        rentPrice, 
        parking, 
        sellContactNo, 
        bathroom, 
        postedOn, 
        expiredOn 
    } = req.body;

    // Validate required fields
    if (!roomDescription || !purpose || !floor || !status || !rentPrice || !parking || !sellContactNo || !bathroom || !postedOn || !expiredOn) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
        });
    }

    // Check if room image is provided
    if (!req.files || !req.files.roomImage) {
        return res.status(400).json({
            success: false,
            message: "Room image is required"
        });
    }

    const { roomImage } = req.files;
    const imageName = `${Date.now()}-${roomImage.name}`;
    const imageUploadPath = path.join(__dirname, `../public/rooms/${imageName}`);

    try {
        // Move image to the upload folder
        await roomImage.mv(imageUploadPath);

        // Save product data to database
        const newProduct = new productModel({
            roomDescription,
            purpose,
            floor,
            status,
            rentPrice,
            parking,
            sellContactNo,
            bathroom,
            postedOn,
            expiredOn,
            roomImage: imageName
        });

        const product = await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product Created Successfully!",
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({
            success: true,
            message: "Products fetched successfully!",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Fetch a single product
const getProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product Fetched!',
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete a product and its associated image
const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete the image file from the server
        const oldImagePath = path.join(__dirname, `../public/rooms/${product.roomImage}`);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        if (req.files && req.files.roomImage) {
            const { roomImage } = req.files;
            const imageName = `${Date.now()}-${roomImage.name}`;
            const imageUploadPath = path.join(__dirname, `../public/rooms/${imageName}`);

            // Upload new image
            await roomImage.mv(imageUploadPath);

            // Update room image field
            req.body.roomImage = imageName;

            const existingProduct = await productModel.findById(req.params.id);

            // Remove old room image from the server
            if (existingProduct.roomImage) {
                const oldImagePath = path.join(__dirname, `../public/rooms/${existingProduct.roomImage}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully!",
            updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Search products by room description
const searchProducts = async (req, res) => {
    const searchQuery = req.query.q;

    try {
        const products = await productModel.find({
            roomDescription: { $regex: searchQuery, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            message: "Search results fetched successfully!",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    searchProducts
};
